import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import Primus = require('primus')
import Spark = require('primus-rooms')
import { UserService, UserSpaceService } from '../services'
import { Request } from 'express'
import { WsInAction, WsInMessage, Room, RoomType } from '../services/web-socket'

export enum WsEvent {
  'Error' = 'error',
  'Connect' = 'connection',
  'Data' = 'data',
  'Disconnect' = 'disconnection',
}

export function wsServerHooks(primus: Primus) {
  primus.authorize(async (req: Request, done) => {
    const token = String(req.query?.token)
    if (!token || typeof token === 'undefined' || token === 'undefined') {
      return done(new Error('Missing authorization header'))
    }

    const decoded: any = jwt.verify(token, config.jwt.accessToken.secretKey)
    if (!decoded) {
      return done(new Error('Invalid token'))
    }

    const userId = decoded.id
    const tokenExpiryTimestamp = Number(decoded.exp)

    if (typeof userId !== 'number' || !tokenExpiryTimestamp || tokenExpiryTimestamp === 0) {
      return done(new Error('Invalid payload'))
    }

    const expirationDate = new Date(tokenExpiryTimestamp * 1000)

    if (expirationDate < new Date()) {
      return done(new Error('Token expired'))
    }

    const user = await UserService.getInstance().getUserById(userId)

    if (!user) {
      return done(new Error('Wrong token'))
    }

    req.user = { ...user, spaces: new Map<number, number>() }
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

  spark.on(WsEvent.Data, async (message: WsInMessage) => {
    message.user = spark.request.user

    if (!message || !message.action) {
      return
    }

    switch (message.action) {
      case WsInAction.Echo:
        echo(spark, message)
        break

      case WsInAction.Join:
        await joinRoom(spark, message)
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
  })
}

function echo(spark: Spark, message: WsInMessage) {
  spark.join(message.room, async () => {
    const user = spark.request.user
    spark.write(`[${spark.id}] ${user.firstName} ${user.lastName} echo test`)
  })
}

async function canJoin(user: any, room: Room): Promise<boolean> {
  if (room.getType() === RoomType.App) {
    return true
  }

  const result = await UserSpaceService.getInstance().isUserInSpace(user.id, room.getSpaceId())
  return result
}

async function joinRoom(spark: Spark, message: WsInMessage) {
  const user = spark.request.user
  const roomName = message.room

  const room = new Room(roomName)
  const allowed = await canJoin(user, room)

  if (!allowed) {
    spark.write(`[${spark.id}] ${user.firstName} ${user.lastName} is not allowed to joined room ${room.getName()}`)
    return
  }

  spark.join(room.getName(), async () => {
    // send message to this client
    spark.write(`[${spark.id}] ${user.firstName} ${user.lastName} joined room ${room.getName()}`)

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

function leaveRoom(spark: Spark, message: WsInMessage) {
  const room = new Room(message.room)

  if (!room) {
    spark.write(`[${spark.id}] Invalid room name ${message.room}`)
    return
  }

  spark.leave(room.getName(), () => {
    const user = spark.request.user
    spark.write(`${user.firstName} ${user.lastName} left room ${room.getName()}`)
  })
}

function leaveAllRooms(spark: Spark) {
  spark.leaveAll(() => {
    const user = spark.request.user
    spark.write(`${user.firstName} ${user.lastName} left all rooms`)
  })
}
