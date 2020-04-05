require('dotenv').config()
import db from './db'
import express, { Application } from 'express'
import * as bodyParser from 'body-parser'
import router from './router'
import passport from './passport'


export default class Server {

  app: Application

  constructor () {
    this.app = express()
  }

  async bootstrap () {

    await db()

    this.app.use(bodyParser.json())
    this.app.use(passport.initialize())
    this.app.use(router)
  }

  listen () {
    this.app.listen(3000, () =>
      console.log('🚀 Server ready at: http://localhost:3000')
    )
  }
}


