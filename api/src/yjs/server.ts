import { String } from 'aws-sdk/clients/apigateway'
import * as dotenv from 'dotenv'
dotenv.config()

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
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
    if (typeof message === 'string') {
      this.onAuthMessage(conn, req, message)
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

  private onAuthMessage = async (conn: WebSocket, req: Http.IncomingMessage, token: String) => {
    const docName = req.url.slice(1)
    const user = await authenticate(token)

    if (!user) {
      conn.send('unauthenticated')
      conn.close()
      return
    }

    const docId = Number(docName.split('_').pop())

    if (!(await authorize(user.id, docId))) {
      conn.send('unauthorized')
      conn.close()
      return
    }

    Object.assign(conn, { user: user })

    conn.on('close', async () => {
      if (state.isLocked(docName)) {
        return
      }

      const sharedDoc = wsUtils.docs.get(docName)
      await state.save(docName, (conn as any).user.id, sharedDoc)
    })

    wsUtils.setupWSConnection(conn, req)
    conn.send(state.isLocked(docName) ? 'wait' : 'init')
  }

  private onRestoreMessage = async (conn: WebSocket, req: Http.IncomingMessage, revisionId: number) => {
    console.log('onRestoreMessage')
    const userId = (conn as any).user.id
    const docName = req.url.slice(1)
    const sharedDoc = wsUtils.docs.get(docName)

    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageRestore)

    state.lock(docName)

    sharedDoc.conns.forEach(async (_, c: WebSocket) => {
      c.send(encoding.toUint8Array(encoder))
    })

    try {
      await state.restore(docName, userId, revisionId, sharedDoc)
      wsUtils.docs.delete(docName)
    } catch (err) {
      console.log(err)
    }

    state.unlock(docName)
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}
