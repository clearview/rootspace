import httpRequestContext from 'http-request-context'
import 'dotenv/config'
import db from './db'
import { config } from 'node-config-ts'
import express, { Application } from 'express'
import * as Sentry from '@sentry/node'
import * as http from 'http'
import cors from 'cors'
import routers from './routers'
import passport from './passport'
import { errorHandler } from './middleware/ErrorMiddleware'
import { wsServerHooks } from './middleware/WsMiddleware'
import { Ability } from '@casl/ability'
import { WebSocketsService } from './services'
import Primus = require('primus')
import Rooms = require('primus-rooms')

declare global {
  namespace Express {
    interface User {
      id: number
      firstName: string
      lastName: string
      email: string
      ability: Ability
      spaces: Map<number, number>
    }
  }
}

export default class Server {
  app: Application
  httpServer: http.Server
  wsServer: Primus

  constructor() {
    this.app = express()
    this.httpServer = http.createServer(this.app)

    this.wsServer = new Primus(this.httpServer, {
      pathname: config.ws.path,
      parser: 'JSON',
      transformer: 'websockets',
      plugin: {'rooms': Rooms},
    })

    wsServerHooks(this.wsServer)

    this.app.use(httpRequestContext.middleware())
  }

  async bootstrap() {
    WebSocketsService.initFromWebSocketServer(this.wsServer)

    if (config.env === 'production') {
      Sentry.init({ dsn: config.sentry.dsn })
      this.app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
    }

    if (config.env !== 'test') {
      await db()
    }

    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(passport.initialize())
    this.app.use(...routers)

    if (config.env === 'production') {
      this.app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)
    }

    this.app.use(errorHandler)
  }

  listen(port?: number) {
    if (!port) {
      port = config.port
    }

    this.httpServer.listen(port, () => {
      console.log(`🚀 Server ready at: http://localhost:${port}`) // tslint:disable-line
    })
  }

  close() {
    if (this.httpServer) {
      this.httpServer.close()
    }
  }
}
