/**
 * @type {any}
 */

import * as http from 'http'
import * as WebSocket from 'ws'

const wsUtils = require('y-websocket/bin/utils.js')
const Y = require('yjs')

const PGPool = require('pg').Pool

const db = new PGPool({
  connectionString: 'postgresql://user:password@postgres:5432/root'
})

const port = 6001

const persistence = {
  bindState: async (identifier, ydoc) => {
    console.log('yjs bindState for', identifier)
    const docId = identifier.split('_').pop()

    return db
      .query('SELECT "docState" FROM docs WHERE id = $1 LIMIT 1', [docId])
      .then((res) => {
        console.log('loaded state for ', docId)
        const initialState = res.rows[0].docState
        if (initialState) {
          console.log('applied initial update', identifier)
          Y.applyUpdate(ydoc, initialState)
        }
      })
      .catch((e) => {
        console.log('failed to load', identifier, e)
      })
  },

  writeState: (identifier, ydoc) => {
    console.log('yjs writeState for', identifier)
    const docId = identifier.split('_').pop()

    const state = Y.encodeStateAsUpdate(ydoc)
    const rawText = ydoc.getText('quill').toString()
    const delta = ydoc.getText('quill').toDelta()
    const deltaJSON = JSON.stringify(delta, null, 2)
    // TODO: add support for custom blots
    // const html = rawText; //QuillConverter.convertDeltaToHtml(delta);
    // const mdast = null;// MdastFromQuillDelta(new QuillDelta(delta));
    // const mdastJSON = '{}';//JSON.stringify(mdast, null, 2);

    return db
      .query('UPDATE docs SET "docState" = $1  WHERE id = $2', [state, docId])
      .then((res) => {
        console.log('updated', identifier)
      })
      .catch((e) => {
        console.log('failed to update', identifier, e)
      })
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
