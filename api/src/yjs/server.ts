import * as dotenv from 'dotenv'
dotenv.config()

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as yWsUtils from '../services/y-websocket/yWebsocketService'
import { User } from '../database/entities/User'
import { authenticate, authorize } from './auth'
import * as state from './state'

/* tslint:disable */
const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')
/* tslint:enable */

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
      conn.on('message', (message) => {
        onInitMessage(conn, req, message)
      })
    })
  }

  private handleUpgrade = (ws: UserWebSocket, request: Http.IncomingMessage) => {
    this.wss.emit('connection', ws, request)
  }

  listen() {
    this.httpServer.listen(this.port)
    console.log(`🚀 y-websocket listening to http://localhost:${this.port}`) // tslint:disable-line
  }
}

const messageSync = 0 // from yjs implementation

const messageType = {
  authenticate: 10,
  unauthenticated: 11,
  unauthorized: 12,
  wait: 13,
  initCollaboration: 14,
  restore: 15,
}

const encodeMessage = (message: number) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, message)
  return encoding.toUint8Array(encoder)
}

const reqDocName = (req: Http.IncomingMessage) => {
  return req.url.slice(1)
}

const waitingConns = new Map<UserWebSocket, Http.IncomingMessage>()

const connWait = (conn: UserWebSocket, req: Http.IncomingMessage) => {
  console.log('connWait user', conn.user.id, reqDocName(req)) // tslint:disable-line
  conn.on('close', () => {
    waitingConnOnClose(conn, req)
  })

  waitingConns.set(conn, req)
  conn.send(encodeMessage(messageType.wait))
}

const waitingConnOnClose = (conn: UserWebSocket, req: Http.IncomingMessage) => {
  console.log('waitingConnOnClose user', conn.user.id, reqDocName(req)) // tslint:disable-line
  waitingConns.delete(conn)
}

state.queue.on('dequeued', (docName) => {
  console.log('on dequeued', docName) // tslint:disable-line

  waitingConns.forEach((req, conn) => {
    const cDocName = req.url.slice(1)

    if (cDocName === docName) {
      conn.off('close', waitingConnOnClose)
      setupCollaboration(conn, req)
      waitingConns.delete(conn)
    }
  })
})

const setupCollaboration = (conn: UserWebSocket, req: Http.IncomingMessage) => {
  conn.off('message', onInitMessage)

  conn.on('close', async () => {
    connOnCloseBeforeYWS(conn, req)
  })

  yWsUtils.setupWSConnection(conn, req)

  conn.on('message', (message) => {
    onMessage(conn, req, message)
  })

  conn.send(encodeMessage(messageType.initCollaboration))
}

const onInitMessage = async (conn: UserWebSocket, req: Http.IncomingMessage, message: any) => {
  const docName = req.url.slice(1)
  const docId = Number(docName.split('_').pop())
  const decoder = decoding.createDecoder(new Uint8Array(message))
  const msgType = decoding.readVarUint(decoder)

  if (msgType !== messageType.authenticate) {
    return
  }

  const token = decoding.readVarString(decoder)
  const user = await authenticate(token)

  if (!user) {
    conn.send(encodeMessage(messageType.unauthenticated))
    return null
  }

  if (!(await authorize(user.id, docId))) {
    conn.send(encodeMessage(messageType.unauthorized))
    return null
  }

  conn.user = user

  if (state.queue.isRunning(docName) === true) {
    connWait(conn, req)
    return
  }

  setupCollaboration(conn, req)
}

const onMessage = (conn: UserWebSocket, req: Http.IncomingMessage, message: any) => {
  const docName = req.url.slice(1)

  const decoder = decoding.createDecoder(new Uint8Array(message))
  const msgType = decoding.readVarUint(decoder)

  if (!conn.user) {
    conn.close()
    return
  }

  const sharedDoc = yWsUtils.docs.get(docName)

  if (msgType === messageSync) {
    const syncMessageType = decoding.readVarUint(decoder)
    if (syncMessageType > 0) {
      state.onUpdate(req.url.slice(1), conn.user.id, sharedDoc)
    }
  }

  if (msgType === messageType.restore) {
    console.log('onRestoreMessage user', conn.user.id, docName) // tslint:disable-line
    const revisionId = decoding.readVarUint(decoder)

    state.onRestore(docName, conn.user.id, revisionId, sharedDoc)

    sharedDoc.conns.forEach(async (_: any, c: WebSocket) => {
      c.send(encodeMessage(messageType.restore))
    })
  }
}

const connOnCloseBeforeYWS = async (conn: UserWebSocket, req: Http.IncomingMessage) => {
  const docName = reqDocName(req)
  console.log('connOnCloseBeforeYWS user', conn.user.id, docName) // tslint:disable-line

  const sharedDoc = yWsUtils.docs.get(docName)

  state.onClientClose(docName, conn.user.id, sharedDoc)
}
