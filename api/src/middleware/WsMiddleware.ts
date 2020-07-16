import { Message } from '../services/models/Message'
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

  primus.authorize((req, done) => {
    // try { auth = authParser(req.headers['authorization']) }
    // catch (ex) { return done(ex) }
    //
    // //
    // // Do some async auth check
    // //
    // authCheck(auth, done)
    done()
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
  spark.on(WsEvent.Data, (message: Message) => {
    // tslint:disable-next-line:no-console
    console.log('[server](message): %s', JSON.stringify(message))
  })
}
