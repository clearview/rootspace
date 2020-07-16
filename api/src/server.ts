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
  app: Application
  server: http.Server
  primus: Primus

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)

    this.primus = new Primus(this.server, { transformer: 'websockets' })
    wsServerHooks(this.primus)
    this.app.use(httpRequestContext.middleware())

    if (config.env === 'production') {
      Sentry.init({ dsn: config.sentry.dsn })
      this.app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
    }
  }

  async bootstrap() {
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

    this.server.listen(port, () => {
      console.log(`🚀 Server ready at: http://localhost:${port}`) // tslint:disable-line
    })
  }

  close() {
    if (this.server) {
      this.server.close()
    }
  }
}
