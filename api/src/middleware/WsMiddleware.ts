import { Message } from '../services/models/message'
import { Server } from 'sockjs-node'

export enum WsEvent {
  'Error'= 'error',
  'Connect'= 'connect',
  'Message'= 'message',
  'Disconnect'= 'disconnect'
}

export function wsServerHooks(wsServer: Server) {
   wsServer.on(WsEvent.Connect, (conn) => {
     onConnect(wsServer, conn)
   })

  wsServer.on(WsEvent.Disconnect, (conn) => {
    onDisconnect(wsServer, conn)
  })
}

function onConnect(wsServer: Server, socket: any): any {
  socket.on(WsEvent.Message, (m: Message) => {
    // tslint:disable-next-line:no-console
    console.log('[server](message): %s', JSON.stringify(m))
    wsServer.emit(WsEvent.Message, m)
  })
}

function onDisconnect(wsServer: Server, socket: any): any {
  socket.on(WsEvent.Disconnect, () => {
    // tslint:disable-next-line:no-console
    console.log('Client disconnected')
  })
}