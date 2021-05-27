import { PrimusRooms } from '../../declarations/PrimusRooms'
import Primus from 'primus'
import { MyEventEmitter } from '../../events/MyEventEmitter'
import { EventName } from '../../events/EventName'
import { Activity } from '../activity/activities/Activity'

export class WebSocketService {
  private static instance: WebSocketService

  private eventEmitter: MyEventEmitter
  private wsServer: PrimusRooms

  static initialize(wsServer: Primus) {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(wsServer)
    }

    return WebSocketService.instance
  }

  private constructor(wsServer: Primus) {
    this.eventEmitter = MyEventEmitter.getInstance()
    this.wsServer = wsServer as PrimusRooms

    this.eventEmitter.on(EventName.Activity, async (activity: Activity) => {
      await WebSocketService.instance.broadcastActivity(activity)
    })
  }

  async broadcastActivity(activity: Activity): Promise<void> {
    this.wsServer.room(activity.pushTo()).write(activity.data())
  }
}
