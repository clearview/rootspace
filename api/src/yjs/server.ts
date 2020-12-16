import * as dotenv from 'dotenv'
dotenv.config()

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
import { authenticate, authorize } from './auth'
import { persistence, saveState, docMonitor, onDocUpdate } from './persistence'

const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')

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
    const docName = req.url.slice(1)

    if (typeof message === 'string') {
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

      ;(conn as any).user = user

      conn.on('close', async () => {
        await this.connOnClose(conn, docName)
      })

      wsUtils.setupWSConnection(conn, req)
      conn.send('authorized')
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
      this.onSyncMessage(decoder, encoder, docName, (conn as any).user.id)
    }
  }

  private onSyncMessage = (decoder: any, encoder: any, docName: string, userId: number) => {
    console.log('syncMessage')

    const syncMessageType = decoding.readVarUint(decoder)
    console.log('syncMessageType', syncMessageType)

    const updateMessage: Uint8Array = decoding.readVarUint8Array(decoder)
    console.log(updateMessage)

    if (syncMessageType > 0) {
      onDocUpdate(docName, userId)
    }
  }

  private connOnClose = async (conn: WebSocket, docName: string) => {
    if (docMonitor.has(docName) === false) {
      return
    }

    const updatedBy = docMonitor.get(docName).updatedBy
    const userId = (conn as any).user.id

    if (!updatedBy.includes(userId)) {
      return
    }

    docMonitor.get(docName).updatedBy = updatedBy.filter((value) => value !== userId)

    const sharedDoc = wsUtils.docs.get(docName)
    await saveState(docName, userId, sharedDoc)
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}
