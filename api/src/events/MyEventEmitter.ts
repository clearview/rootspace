import { EventEmitter } from 'events'

export class MyEventEmitter extends EventEmitter {
  private static instance: MyEventEmitter

  private constructor() {
    super()
  }

  static getInstance() {
    if (!MyEventEmitter.instance) {
      MyEventEmitter.instance = new MyEventEmitter()
    }

    return MyEventEmitter.instance
  }
}
