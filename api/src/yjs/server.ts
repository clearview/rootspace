import * as dotenv from 'dotenv'
dotenv.config()

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
import { User } from '../database/entities/User'
import { authenticate, authorize } from './auth'
import * as state from './state'

const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')

const messageSync = 0
const messageRestore = 6

wsUtils.setPersistence(state.persistence)

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
      this.wss.handleUpgrade(request, socket, head, this.handleAuth)
    })

    this.wss.on('connection', (conn: WebSocket, req: Http.IncomingMessage, {} = {}) => {
      conn.on('message', async (message) => {
        await this.onMessage(conn, req, message)
      })
    })
  }

  private handleAuth = (ws: WebSocket, request: Http.IncomingMessage) => {
    this.wss.emit('connection', ws, request)
  }

  private onMessage = async (conn: WebSocket, req: Http.IncomingMessage, message: any) => {
    const docName = req.url.slice(1)

    if (typeof message === 'string') {
      const user = await this.auth(conn, req, message)

      if (!user) {
        conn.close()
        return
      }

      Object.assign(conn, { user })

      conn.on('close', async () => {
        this.connOnClose(conn, docName)
      })

      wsUtils.setupWSConnection(conn, req)

      if (state.isLocked(docName)) {
        state.locks.get(docName).push(conn)
      } else {
        conn.send('init')
      }

      return
    }

    if (!(conn as any).user) {
      conn.close()
    }

    const decoder = decoding.createDecoder(new Uint8Array(message))
    const messageType = decoding.readVarUint(decoder)

    console.log('messageType', messageType) // tslint:disable-line

    if (messageType === messageRestore) {
      const revisionId = decoding.readVarUint(decoder)
      await this.onRestoreMessage(conn, req, revisionId)
      return
    }

    if (messageType === messageSync) {
      const syncMessageType = decoding.readVarUint(decoder)
      console.log('syncMessageType', syncMessageType) // tslint:disable-line

      if (syncMessageType > 0) {
        state.onUpdate(req.url.slice(1), (conn as any).user.id)
      }
    }
  }

  private auth = async (conn: WebSocket, req: Http.IncomingMessage, token: string): Promise<User | null> => {
    const docName = req.url.slice(1)
    const user = await authenticate(token)

    if (!user) {
      conn.send('unauthenticated')
      return null
    }

    const docId = Number(docName.split('_').pop())

    if (!(await authorize(user.id, docId))) {
      conn.send('unauthorized')
      return null
    }

    return user
  }

  private connOnClose = async (conn: WebSocket, docName: string) => {
    console.log('conn on close') // tslint:disable-line

    const sharedDoc = wsUtils.docs.get(docName)

    if (!sharedDoc) {
      return
    }

    const connsCount = sharedDoc.conns.size
    console.log('connsCount', connsCount) // tslint:disable-line

    if (state.isLocked(docName) === false) {
      await state.save(docName, (conn as any).user.id, sharedDoc)

      if (connsCount < 2) {
        state.clearMonitors(docName)
      }

      return
    }

    if (connsCount < 2) {
      if (state.restoreMonitor.get(docName)) {
        const info = state.restoreMonitor.get(docName)

        try {
          await state.restore(docName, info.userId, info.revisionId, sharedDoc)
        } catch (err) {
          console.log(err) // tslint:disable-line
        }
      }

      state.clearMonitors(docName)

      const waitingConns = state.locks.get(docName)
      state.unlock(docName)

      waitingConns.forEach(async (c: WebSocket) => {
        c.send('init')
      })
    }
  }

  private onRestoreMessage = async (conn: WebSocket, req: Http.IncomingMessage, revisionId: number) => {
    console.log('onRestoreMessage') // tslint:disable-line
    const userId = (conn as any).user.id
    const docName = req.url.slice(1)
    const sharedDoc = wsUtils.docs.get(docName)

    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageRestore)

    state.onRestore(docName, userId, revisionId)
    state.lock(docName)

    sharedDoc.conns.forEach(async (_, c: WebSocket) => {
      c.send(encoding.toUint8Array(encoder))
    })
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}
