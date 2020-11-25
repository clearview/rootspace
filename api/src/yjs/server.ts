import * as Http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
import * as Y from 'yjs'
import jwt from 'jsonwebtoken'
import { config } from 'node-config-ts'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { UserService } from '../services'

const port = 6001

const persistence = {
  bindState: async (identifier: string, ydoc: Y.Doc) => {
    console.log('yjs bindState for', identifier) // tslint:disable-line

    const docId = Number(identifier.split('_').pop())

    const doc = await ServiceFactory.getInstance()
      .getDocService()
      .getById(docId)

    if (doc && doc.contentState) {
      const state = new Uint8Array(doc.contentState)
      Y.applyUpdate(ydoc, state)
    }
  },

  writeState: async (identifier: string, ydoc: Y.Doc) => {
    console.log('yjs writeState for', identifier) // tslint:disable-line

    const docId = Number(identifier.split('_').pop())
    const state = Y.encodeStateAsUpdate(ydoc)

    const docService = ServiceFactory.getInstance().getDocService()
    const doc = await docService.getById(docId)

    if (doc) {
      doc.contentState = Array.from(state)
      await docService.getDocRepository().save(doc)
    }
  },
}

const authenticate = async (conn: any, token: string): Promise<boolean> => {
  try {
    const decoded: any = jwt.verify(token, config.jwt.accessToken.secretKey)
    const userId = decoded.id

    if (typeof userId !== 'number') {
      return false
    }

    const user = await UserService.getInstance().getUserById(userId)

    if (!user) {
      return false
    }

    conn.user = user

    return true
  } catch (err) {
    return false
  }
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
    const docName = req.url.slice(1)

    if (typeof message === 'string') {
      const authenticated = await authenticate(conn, message)

      if (authenticated === false) {
        conn.send('unauthenticated')
        conn.close()
        return
      }

      wsUtils.setupWSConnection(conn, req, docName)
      conn.send('authenticated')
      return
    }

    if (!(conn as any).user) {
      conn.send('unauthenticated')
      conn.close()
    }
  }

  listen() {
    this.httpServer.listen(port)
    console.log(`🚀 y-websocket listening to http://localhost:${port}`) // tslint:disable-line
  }
}
