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

const messageSync = 0 // used by yjs

const wsMessageType = {
  authenticate: 10,
  unauthenticated: 11,
  unauthorized: 12,
  wait: 13,
  initCollaboration: 14,
  restore: 15,
}

const encodeMessage = (messageType: number) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageType)
  return encoding.toUint8Array(encoder)
}

yWsUtils.setPersistence(state.persistence)

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

    this.wss.on('connection', (conn: WebSocket, req: Http.IncomingMessage, {} = {}) => {
      conn.on('message', async (message) => {
        await this.onMessage(conn, req, message)
      })
    })
  }

  private handleUpgrade = (ws: WebSocket, request: Http.IncomingMessage) => {
    this.wss.emit('connection', ws, request)
  }

  private auth = async (conn: WebSocket, req: Http.IncomingMessage, token: string): Promise<User | null> => {
    const docName = req.url.slice(1)
    const user = await authenticate(token)

    if (!user) {
      conn.send(encodeMessage(wsMessageType.unauthenticated))
      return null
    }

    const docId = Number(docName.split('_').pop())

    if (!(await authorize(user.id, docId))) {
      conn.send(encodeMessage(wsMessageType.unauthorized))
      return null
    }

    return user
  }

  private onMessage = async (conn: WebSocket, req: Http.IncomingMessage, message: any) => {
    const docName = req.url.slice(1)

    const decoder = decoding.createDecoder(new Uint8Array(message))
    const messageType = decoding.readVarUint(decoder)

    if (messageType === wsMessageType.authenticate) {
      const token = decoding.readVarString(decoder)
      const user = await this.auth(conn, req, token)

      if (!user) {
        conn.close()
        return
      }

      Object.assign(conn, { user })

      if (state.isLocked(docName) === true) {
        state.locks.get(docName).push(conn)
        conn.send(encodeMessage(wsMessageType.wait))
        return
      }

      this.setupCollaboration(conn, req)

      conn.send(encodeMessage(wsMessageType.initCollaboration))
      return
    }

    if (!(conn as any).user) {
      conn.close()
      return
    }

    if (messageType === wsMessageType.restore) {
      await this.onRestoreMessage(conn, req, message)
      return
    }

    if (messageType === messageSync) {
      const syncMessageType = decoding.readVarUint(decoder)
      if (syncMessageType > 0) {
        state.onUpdate(req.url.slice(1), (conn as any).user.id)
      }
    }
  }

  private onRestoreMessage = async (conn: WebSocket, req: Http.IncomingMessage, message: any) => {
    console.log('onRestoreMessage') // tslint:disable-line

    const userId = (conn as any).user.id
    const docName = req.url.slice(1)
    const sharedDoc = yWsUtils.docs.get(docName)

    const decoder = decoding.createDecoder(new Uint8Array(message))
    const messageType = decoding.readVarUint(decoder)
    const revisionId = decoding.readVarUint(decoder)

    state.onRestore(docName, userId, revisionId)
    state.lock(docName)

    sharedDoc.conns.forEach(async (_, c: WebSocket) => {
      c.send(encodeMessage(wsMessageType.restore))
    })
  }

  private setupCollaboration(conn: WebSocket, req: Http.IncomingMessage) {
    conn.on('close', async () => {
      this.connOnClose(conn, req)
    })

    yWsUtils.setupWSConnection(conn, req)
    conn.send(encodeMessage(wsMessageType.initCollaboration))
  }

  private connOnClose = async (conn: WebSocket, req: Http.IncomingMessage) => {
    console.log('conn on close') // tslint:disable-line

    const docName = req.url.slice(1)
    const sharedDoc = yWsUtils.docs.get(docName)

    if (!sharedDoc) {
      return
    }

    const connsCount = sharedDoc.conns.size
    console.log('connsCount', connsCount) // tslint:disable-line

    if (state.isLocked(docName) === false) {
      await state.save(docName, (conn as any).user.id, sharedDoc)

      if (connsCount < 2) {
        state.clearMonitoring(docName)
      }

      return
    }

    if (connsCount < 2) {
      if (state.restoreMonitor.get(docName)) {
        const restoreInfo = state.restoreMonitor.get(docName)
        const updateBy = state.docMonitor.get(docName).updatedBy

        for (const userId of updateBy) {
          await state.save(docName, userId, sharedDoc)
        }

        try {
          await state.restore(restoreInfo.revisionId, restoreInfo.userId)
        } catch (err) {
          console.log(err) // tslint:disable-line
        }
      }

      const waitingConns = state.locks.get(docName)

      state.clearMonitoring(docName)
      state.unlock(docName)

      waitingConns.forEach(async (c: WebSocket) => {
        c.send(encodeMessage(wsMessageType.initCollaboration))
      })
    }
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}
