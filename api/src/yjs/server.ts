import * as dotenv from 'dotenv'
dotenv.config()
import { config } from 'node-config-ts'

import * as Http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
import * as Y from 'yjs'
import jwt from 'jsonwebtoken'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { UserService } from '../services'
import { User } from '../database/entities/User'
import { DocUpdateValue } from '../values/doc'

const syncProtocol = require('y-protocols/dist/sync.cjs')
const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')

const port = 6001
const messageSync = 0
const docUpdateUsersMap = new Map<string, number[]>()

const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('yjs bindState for', docName) // tslint:disable-line

    const docId = Number(docName.split('_').pop())

    const doc = await ServiceFactory.getInstance()
      .getDocService()
      .getById(docId)

    if (doc && doc.contentState) {
      const state = new Uint8Array(doc.contentState)
      Y.applyUpdate(ydoc, state)
    }
  },

  writeState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('yjs writeState for', docName) // tslint:disable-line

    const docId = Number(docName.split('_').pop())
    const state = Y.encodeStateAsUpdate(ydoc)

    const data = DocUpdateValue.fromObject({
      contentState: Array.from(state),
    })

    const userIds = docUpdateUsersMap.get(docName)
    docUpdateUsersMap.delete(docName)

    await ServiceFactory.getInstance()
      .getDocService()
      .updateContentState(data, docId, userIds)
  },
}

const authenticate = async (token: string): Promise<User | null> => {
  try {
    const decoded: any = jwt.verify(token, config.jwt.accessToken.secretKey)
    const userId = decoded.id

    if (typeof userId !== 'number') {
      return null
    }

    const user = await UserService.getInstance().getUserById(userId)

    return user ?? null
  } catch (err) {
    return null
  }
}

const authorize = async (userId: number, docId: number): Promise<boolean> => {
  const doc = await ServiceFactory.getInstance()
    .getDocService()
    .getById(docId)

  if (!doc) {
    return false
  }

  const inSpace = await ServiceFactory.getInstance()
    .getUserSpaceService()
    .isUserInSpace(userId, doc.spaceId)

  if (inSpace) {
    return true
  }

  return false
}

wsUtils.setPersistence(persistence)

export default class YjsServer {
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

    const decoder = decoding.createDecoder(new Uint8Array(message))
    const messageType = decoding.readVarUint(decoder)

    if (messageType === 0) {
      this.onSyncMessage(conn, req, message)
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

    ;(conn as any).user = user

    wsUtils.setupWSConnection(conn, req, docName)
    conn.send('authorized')
  }

  private onSyncMessage = (conn: WebSocket, req: Http.IncomingMessage, message: any) => {
    console.log('onSyncMessage')
    const docName = req.url.slice(1)
    const ydoc = wsUtils.docs.get(docName)

    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(new Uint8Array(message))

    decoding.readVarUint(decoder) // don't remove this line
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.readSyncMessage(decoder, encoder, ydoc, null)

    console.log(encoding.length(encoder))

    if (encoding.length(encoder) !== 0) {
      return
    }

    const docUpdateUserIds = docUpdateUsersMap.get(docName) ?? []
    const userId = (conn as any).user.id

    if (docUpdateUserIds.includes(userId)) {
      return
    }

    docUpdateUserIds.push(userId)
    docUpdateUsersMap.set(docName, docUpdateUserIds)
  }

  listen() {
    this.httpServer.listen(port)
    console.log(`🚀 y-websocket listening to http://localhost:${port}`) // tslint:disable-line
  }
}
