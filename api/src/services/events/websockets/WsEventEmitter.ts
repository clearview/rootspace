import { EventEmitter } from 'events'

export class WsEventEmitter extends EventEmitter {
  private static instance: WsEventEmitter

  private constructor() {
    super()
  }

  static getInstance() {
    if (!WsEventEmitter.instance) {
      WsEventEmitter.instance = new WsEventEmitter()
    }

    return WsEventEmitter.instance
  }
}
