import { Message } from '../services/models/message'
import Primus = require('primus')
import { Spark } from 'primus'

export enum WsEvent {
  'Error'= 'error',
  'Connect'= 'connection',
  'Data'= 'data',
  'Disconnect'= 'disconnection'
}

export function wsServerHooks(primus: Primus) {
   primus.on(WsEvent.Connect, (spark: Spark) => {
     onConnect(spark)
   })

  primus.on(WsEvent.Disconnect, (spark: Spark) => {
    onDisconnect(spark)
  })
}

function onConnect(spark: Spark): any {
  spark.write('Client connected')
  onData(spark)
}

function onDisconnect(spark: Spark): any {
  // tslint:disable-next-line:no-console
  console.log('Client disconnected')
  spark.write('Client disconnected')
}

function onData(spark: Spark): any {
  spark.on(WsEvent.Data, (m: Message) => {
    // tslint:disable-next-line:no-console
    console.log('[server](message): %s', JSON.stringify(m))
  })
}
