import httpRequestContext from 'http-request-context'
import 'dotenv/config'
import db from './db'
import { config } from 'node-config-ts'
import express, { Application } from 'express'
import { setQueues, UI } from 'bull-board'
import * as Sentry from '@sentry/node'
import * as http from 'http'
import cors from 'cors'
import routers from './routers'
import passport from './passport'
import { errorHandler } from './middleware/ErrorMiddleware'
import { Ability } from '@casl/ability'
import { NotificationListener } from './services'
import { ActivityService } from './services/content/ActivityService'

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
  instance: http.Server
  listener: NotificationListener

  constructor() {
    this.app = express()
    this.app.use(httpRequestContext.middleware())

    this.instance = null
    this.listener = NotificationListener.getInstance()

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

    setQueues([ActivityService.getInstance().queue])
    this.app.use('/admin/queues', UI)
  }

  listen(port?: number) {
    if (!port) {
      port = config.port
    }

    this.instance = this.app.listen(port, () => {
      console.log(`🚀 Server ready at: http://localhost:${port}`) // tslint:disable-line
    })
  }

  close() {
    if (this.instance) {
      this.instance.close()
    }
  }
}
