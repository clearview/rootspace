/**
 * @type {any}
 */

import * as http from 'http'
import * as WebSocket from 'ws'

const setupWSConnection = require('y-websocket/bin/utils.js').setupWSConnection
const port = 3005

export default class YjsServer {
  httpServer: http.Server
  wss: any

  constructor() {
    this.httpServer = http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('Okay')
    })

    this.wss = new WebSocket.Server({ noServer: true })
    this.wss.on('connection', setupWSConnection)

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
