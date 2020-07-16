import { config } from 'node-config-ts'
import { Message } from '../services/models/Message'
import Primus = require('primus')
import { Spark } from 'primus'
import jwt from 'jsonwebtoken'
import { UserService } from '../services'

export enum WsEvent {
  'Error'= 'error',
  'Connect'= 'connection',
  'Data'= 'data',
  'Disconnect'= 'disconnection'
}

export function wsServerHooks(primus: Primus) {
  primus.authorize(async (req, done) => {
    const token = String(req.headers?.token)

    if (!token || typeof token === 'undefined' || token === 'undefined') {
      return done(new Error('Missing token'))
    }

    const decoded: any = jwt.verify(token, config.jwtSecretKey)
    if (!decoded) {
      return done(new Error('Invalid token'))
    }

    const userId = decoded.id

    if (typeof userId !== 'number') {
      return done(new Error('Invalid payload'))
    }

    const user = await UserService.getInstance().getUserById(userId)
    if (!user) {
      return done(new Error('Wrong token'))
    }

    done()
  })

  primus.on(WsEvent.Connect, (spark: Spark) => {
     onConnect(spark)
   })

  primus.on(WsEvent.Disconnect, (spark: Spark) => {
    onDisconnect(spark)
  })
}

function onConnect(spark: Spark): any {
  spark.write('Client connected')
  onData(spark)
}

function onDisconnect(spark: Spark): any {
  // tslint:disable-next-line:no-console
  console.log('Client disconnected')
  spark.write('Client disconnected')
}

function onData(spark: Spark): any {
  spark.on(WsEvent.Data, (message: Message) => {
    // tslint:disable-next-line:no-console
    console.log('[server](message): %s', JSON.stringify(message))
  })
}
