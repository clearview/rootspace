import * as http from 'http'
import * as WebSocket from 'ws'
import * as wsUtils from 'y-websocket/bin/utils.js'
import * as Y from 'yjs'
import { ServiceFactory } from '../services/factory/ServiceFactory'

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

wsUtils.setPersistence(persistence)

export default class YjsServer {
  httpServer: http.Server
  wss: any

  constructor() {
    this.httpServer = http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('Okay')
    })

    this.wss = new WebSocket.Server({ noServer: true })
    this.wss.on('connection', wsUtils.setupWSConnection)

    this.httpServer.on('upgrade', (request, socket, head) => {
      // You may check auth of request here..
      /**
       * @param {any} ws
       */
      const handleAuth = (ws) => {
        this.wss.emit('connection', ws, request)
      }
      this.wss.handleUpgrade(request, socket, head, handleAuth)
    })
  }

  listen() {
    this.httpServer.listen(port)
    console.log(`🚀 y-websocket listening to http://localhost:${port}`) // tslint:disable-line
  }
}
