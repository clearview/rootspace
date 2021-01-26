import * as dotenv from 'dotenv'
dotenv.config()

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
import { authenticate, authorize } from './auth'
import { persistence, onDocUpdate, onUserDisconnect } from './persistence'

/* tslint:disable */
const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')
/* tslint:enable */

const messageSync = 0

wsUtils.setPersistence(persistence)

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
      await this.onStringMessage(conn, req, message)
      return
    }

    if (!(conn as any).user) {
      conn.close()
    }

    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(new Uint8Array(message))
    const messageType = decoding.readVarUint(decoder)

    if (messageType === messageSync) {
      encoding.writeVarUint(encoder, messageSync)
      const syncMessageType = decoding.readVarUint(decoder)

      console.log('syncMessageType', syncMessageType) // tslint:disable-line

      if (syncMessageType > 0) {
        onDocUpdate(req.url.slice(1), (conn as any).user.id)
      }
    }
  }

  private onStringMessage = async (conn: WebSocket, req: Http.IncomingMessage, message: any) => {
    const docName = req.url.slice(1)
    const user = await authenticate(message)

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

    // tslint:disable-next-line
    ;(conn as any).user = user

    conn.on('close', async () => {
      const sharedDoc = wsUtils.docs.get(docName)
      await onUserDisconnect(docName, (conn as any).user.id, sharedDoc)
    })

    wsUtils.setupWSConnection(conn, req)
    conn.send('authorized')
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}
