import db from './db'
import express, { Application } from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import router from './router'
import passport from './passport'
import { config } from 'node-config-ts'
import {
  validationErrorHandler,
  httpErrorHandler
} from './middleware/ErrorMiddleware'

declare global {
  namespace Express {
    interface User {
      id: number
      name: string
      email: string
    }
  }
}

export default class Server {
  app: Application

  constructor() {
    this.app = express()
  }

  async bootstrap() {
    await db()

    this.app.use(bodyParser.json())
    this.app.use(cors())
    this.app.use(passport.initialize())
    this.app.use(router)
    this.app.use(validationErrorHandler)
    this.app.use(httpErrorHandler)
  }

  listen() {
    this.app.listen(config.port, () => {
      console.log(`🚀 Server ready at: http://localhost:${config.port}`) // tslint:disable-line
    })
  }
}
