import * as dotenv from 'dotenv'
dotenv.config()

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as yWsUtils from 'y-websocket/bin/utils.js'
import { User } from '../database/entities/User'
import { authenticate, authorize } from './auth'
import * as state from './state'

/* tslint:disable */
const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')
/* tslint:enable */

const messageSync = 0 // from yjs implementation

const messageType = {
  authenticate: 10,
  unauthenticated: 11,
  unauthorized: 12,
  wait: 13,
  initCollaboration: 14,
  restore: 15,
}

const waitingConns = new Map<UserWebSocket, string>()

const encodeMessage = (message: number) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, message)
  return encoding.toUint8Array(encoder)
}

yWsUtils.setPersistence(state.persistence)

interface UserWebSocket extends WebSocket {
  user?: User
}

export default class YjsServer {
  port: number = 6001
  httpServer: Http.Server
  wss: WebSocket.Server

  constructor() {
    this.httpServer = Http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('Okay')
    })

    this.wss = new WebSocket.Server({ noServer: true })

    this.httpServer.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, this.handleUpgrade)
    })

    this.wss.on('connection', (conn: UserWebSocket, req: Http.IncomingMessage, {} = {}) => {
      conn.on('message', async (message) => {
        await this.onMessage(conn, req, message)
      })
    })
  }

  private handleUpgrade = (ws: UserWebSocket, request: Http.IncomingMessage) => {
    this.wss.emit('connection', ws, request)
  }

  private connWait(conn: UserWebSocket, docName: string) {
    conn.on('close', () => {
      this.waitingConnOnClose(conn)
    })

    waitingConns.set(conn, docName)
    conn.send(encodeMessage(messageType.wait))
  }

  private setupCollaboration(conn: UserWebSocket, req: Http.IncomingMessage) {
    conn.on('close', async () => {
      this.connOnClose(conn, req)
    })

    yWsUtils.setupWSConnection(conn, req)
    conn.send(encodeMessage(messageType.initCollaboration))
  }

  private onMessage = async (conn: UserWebSocket, req: Http.IncomingMessage, message: any) => {
    const docName = req.url.slice(1)

    const decoder = decoding.createDecoder(new Uint8Array(message))
    const msgType = decoding.readVarUint(decoder)

    if (msgType === messageType.authenticate) {
      const token = decoding.readVarString(decoder)
      const user = await this.onAuthMessage(conn, req, token)

      if (!user) {
        conn.close()
        return
      }

      conn.user = user

      if (state.locks.get(docName) > 0) {
        this.connWait(conn, docName)
        return
      }

      this.setupCollaboration(conn, req)
      return
    }

    if (!conn.user) {
      conn.close()
      return
    }

    if (msgType === messageType.restore) {
      await this.onRestoreMessage(conn, req, message)
      return
    }

    if (msgType === messageSync) {
      const syncMessageType = decoding.readVarUint(decoder)
      if (syncMessageType > 0) {
        state.onUpdate(req.url.slice(1), conn.user.id)
      }
    }
  }

  private onAuthMessage = async (
    conn: UserWebSocket,
    req: Http.IncomingMessage,
    token: string
  ): Promise<User | null> => {
    const docName = req.url.slice(1)
    const user = await authenticate(token)

    if (!user) {
      conn.send(encodeMessage(messageType.unauthenticated))
      return null
    }

    const docId = Number(docName.split('_').pop())

    if (!(await authorize(user.id, docId))) {
      conn.send(encodeMessage(messageType.unauthorized))
      return null
    }

    return user
  }

  private onRestoreMessage = async (conn: UserWebSocket, req: Http.IncomingMessage, message: any) => {
    const docName = req.url.slice(1)
    console.log('onRestoreMessage user', conn.user.id, docName) // tslint:disable-line

    const sharedDoc = yWsUtils.docs.get(docName)

    const connsCount = sharedDoc.conns.size
    console.log('conns count', docName, connsCount) // tslint:disable-line

    const decoder = decoding.createDecoder(new Uint8Array(message))
    const msgType = decoding.readVarUint(decoder)
    const revisionId = decoding.readVarUint(decoder)

    state.lock(docName)
    state.onRestore(docName, conn.user.id, revisionId)

    sharedDoc.conns.forEach(async (_: any, c: WebSocket) => {
      c.send(encodeMessage(messageType.restore))
    })
  }

  private waitingConnOnClose(conn: UserWebSocket) {
    console.log('waitingConnOnClose user', conn.user.id)
    waitingConns.delete(conn)
  }

  private connOnClose = async (conn: UserWebSocket, req: Http.IncomingMessage) => {
    const docName = req.url.slice(1)
    console.log('connOnClose user', conn.user.id, docName) // tslint:disable-line

    const sharedDoc = yWsUtils.docs.get(docName)

    if (!sharedDoc) {
      return
    }

    const connsCount = sharedDoc.conns.size
    console.log('conns count', docName, connsCount) // tslint:disable-line

    if (state.restores.has(docName) === true) {
      if (connsCount > 1) {
        return
      }

      await state.restore(docName, sharedDoc)
      state.unlock(docName)
    } else {
      state.lock(docName)
      await state.save(docName, conn.user.id, sharedDoc)
      state.unlock(docName)
    }

    // All clients diconected from doc, clear monitoring
    if (connsCount < 2) {
      state.clearMonitoring(docName)
    }

    const locks = state.locks.get(docName) ?? 0

    console.log('waigin connections', docName, waitingConns.size)

    if (locks === 0) {
      waitingConns.forEach((cDocName, c) => {
        if (cDocName === docName) {
          c.off('close', this.waitingConnOnClose)
          this.setupCollaboration(c, req)
          waitingConns.delete(c)
        }
      })
    }

    console.log('waigin connections', docName, waitingConns.size)
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}
