import db from './db'
import express, { Application } from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import routers from './routers'
import passport from './passport'
import { config } from 'node-config-ts'
import {
  errorHandler,
} from './middleware/ErrorMiddleware'

declare global {
  namespace Express {
    interface User {
      id: number
      firstName: string,
      lastName: string,
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
    this.app.use(...routers)
    this.app.use(errorHandler)
  }

  listen() {
    const port = process.env.PORT || config.port
    const domain = process.env.DOAMIN || config.domain
    this.app.listen(port, () => {
      console.log(`🚀 Server ready at: ${domain}`) // tslint:disable-line
    })
  }
}
