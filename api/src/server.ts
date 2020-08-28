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
import Primus = require('primus')
import Rooms = require('primus-rooms')
import { WsService } from './services/WsService'

declare global {
  namespace Express {
    interface User {
      id: number
      firstName: string,
      lastName: string,
      email: string,
      ability: Ability
    }
  }
}

export default class Server {
  private static instance: Server
  app: Application
  httpServer: http.Server
  wsServer: Primus

  static getInstance() {
    if (!Server.instance) {
      Server.instance = new Server()
    }

    return Server.instance
  }

  private constructor() {
    this.app = express()
    this.httpServer = http.createServer(this.app)

    this.wsServer = new Primus(this.httpServer, {
      pathname: config.ws.path,
      parser: 'JSON',
      transformer: 'websockets',
      plugin: { 'rooms': Rooms }
    })

    wsServerHooks(this.wsServer)

    this.app.use(httpRequestContext.middleware())
  }

  async bootstrap() {
    WsService.fromServer()

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
