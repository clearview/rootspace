import { PrimusRooms } from '../declarations/PrimusRooms'
import Primus from 'primus'
import { MyEventEmitter } from '../events/MyEventEmitter'
import { EventName } from '../events/EventName'
import { Activity } from './activity/activities/Activity'

export class WebSocketsService {
  private static instance: WebSocketsService
  private eventEmitter: MyEventEmitter
  private wsServer: PrimusRooms

  static initFromWebSocketServer(wsServer: Primus) {
    if (!WebSocketsService.instance) {
      WebSocketsService.instance = new WebSocketsService()
      WebSocketsService.instance.eventEmitter = MyEventEmitter.getInstance()
      WebSocketsService.instance.wsServer = wsServer as PrimusRooms

      WebSocketsService.instance.eventEmitter.on(EventName.Activity, async (activity: Activity) => {
        await WebSocketsService.instance.broadcastActivity(activity)
      })
    }

    return WebSocketsService.instance
  }

  async broadcastActivity(activity: Activity): Promise<void> {
    this.wsServer.room(activity.pushTo()).write(activity.data())
  }
}
