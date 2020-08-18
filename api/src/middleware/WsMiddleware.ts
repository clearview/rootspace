import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import { UserService } from '../services'
import { Request } from 'express'
import { InMessage } from '../services/models/InMessage'
import { WsInAction } from '../services/content/contracts'
import Primus = require('primus')
import Spark = require('primus-rooms')

export enum WsEvent {
  'Error'= 'error',
  'Connect'= 'connection',
  'Data'= 'data',
  'Disconnect'= 'disconnection'
}

export function wsServerHooks(primus: Primus) {
  primus.authorize(async (req: Request, done) => {
    const token = String(req.query?.token)
    if (!token || typeof token === 'undefined' || token === 'undefined') {
      return done(new Error('Missing authorization header'))
    }

    const decoded: any = jwt.verify(token, config.jwtSecretKey)
    if (!decoded) {
      return done(new Error('Invalid token'))
    }

    const userId = decoded.id
    const tokenExpiryTimestamp = Number(decoded.exp)

    if (typeof userId !== 'number' || !tokenExpiryTimestamp || tokenExpiryTimestamp === 0) {
      return done(new Error('Invalid payload'))
    }

    const expirationDate = new Date(tokenExpiryTimestamp * 1000)

    if(expirationDate < new Date()) {
      return done(new Error('Token expired'))
    }

    const user = await UserService.getInstance().getUserById(userId)
    if (!user) {
      return done(new Error('Wrong token'))
    }

    req.user = user

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
  const user = spark.request.user
  spark.write(`${user.firstName} ${user.lastName} connected`)
  onData(spark)
}

function onDisconnect(spark: Spark): any {
  leaveAllRooms(spark)
  const user = spark.request.user
  spark.write(`${user.firstName} ${user.lastName} disconnected`)
}

function onData(spark: Spark): any {
  const user = spark.request.user
  if (!user) {
    return
  }

  spark.on(WsEvent.Data, (message: InMessage) => {
    message.user = spark.request.user

    if (!message || !message.action) {
      return
    }

    switch (message.action) {
      case WsInAction.Join:
        joinRoom(spark, message)
        break

      case WsInAction.List:
        listRooms(spark)
        break

      case WsInAction.Leave:
        leaveRoom(spark, message)
        break

      case WsInAction.LeaveAll:
        leaveAllRooms(spark)
        break
    }

    // tslint:disable-next-line:no-console
    console.log('[server](message): %s', JSON.stringify(message))
  })
}

function joinRoom(spark: Spark, message: InMessage) {
  spark.join(message.room, async () => {
    const user = spark.request.user

    // send message to this client
    spark.write(`${user.firstName} ${user.lastName} joined room ${message.room}`)

    // send message to all clients except this one
    // spark.room(message.room).except(spark.id).write(spark.id + ' joined room ' + message.room)
  })
}

function listRooms(spark: Spark) {
  const user = spark.request.user
  const rooms = spark.rooms()

  if (rooms.length < 1) {
    spark.write(`${user.firstName} ${user.lastName} is not present in any rooms`)
    return
  }

  spark.write(`${user.firstName} ${user.lastName} is present in ${rooms.join(', ')}`)
}

function leaveRoom(spark: Spark, message: InMessage) {
  spark.leave(message.room, () => {
    const user = spark.request.user
    spark.write(`${user.firstName} ${user.lastName} left room ${message.room}`)
  })
}

function leaveAllRooms(spark: Spark) {
  spark.leaveAll(() => {
    const user = spark.request.user
    spark.write(`${user.firstName} ${user.lastName} left all rooms`)
  })
}