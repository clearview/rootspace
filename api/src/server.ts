import db from './db'
import express, { Application } from 'express'
import * as bodyParser from 'body-parser'
import router from './router'
import passport from './passport'
import { config } from 'node-config-ts'

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
    this.app.use(passport.initialize())
    this.app.use(router)
  }

  listen() {
    this.app.listen(config.port, () => {
      console.log(`🚀 Server ready at: http://localhost:${config.port}`) // tslint:disable-line
    })
  }
}
