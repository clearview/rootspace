import { UserService } from './UserService'
import { SpaceService } from './SpaceService'
import { PrimusRooms } from '../declarations/PrimusRooms'
import { ActivityEvent } from './events/ActivityEvent'
import { ActivityService } from './'
import { WsOutMessage } from './models/websockets/WsOutMessage'
import Primus from 'primus'
import { ActivityType } from '../types/activity'
import { WsEventEmitter } from './events/websockets/WsEventEmitter'
import { WsEvent, Events } from './events/websockets/WsEvent'
import { Activity } from './activity/activities/Activity'

export class WebSocketsService {
  private static instance: WebSocketsService
  private wsEventEmitter: WsEventEmitter
  private wsServer: PrimusRooms
  private userService: UserService
  private spaceService: SpaceService
  private activityService: ActivityService

  static initFromWebSocketServer(wsServer: Primus) {
    if (!WebSocketsService.instance) {
      WebSocketsService.instance = new WebSocketsService()
      WebSocketsService.instance.wsEventEmitter = WsEventEmitter.getInstance()
      WebSocketsService.instance.wsServer = wsServer as PrimusRooms
      WebSocketsService.instance.userService = UserService.getInstance()
      WebSocketsService.instance.spaceService = SpaceService.getInstance()
      WebSocketsService.instance.activityService = ActivityService.getInstance()

      WebSocketsService.instance.wsEventEmitter.on(WsEvent.NAME, async (event: ActivityEvent) => {
        await WebSocketsService.instance.broadcast(event)
      })

      WebSocketsService.instance.wsEventEmitter.on(Events.Activity, async (event: Activity) => {
        await WebSocketsService.instance.broadcastActivity(event)
      })
    }

    return WebSocketsService.instance
  }

  async broadcast(event: ActivityEvent): Promise<void> {
    if (!this.shouldBroadcast(event)) {
      return null
    }

    const message = await this.createMessageFromActivityEvent(event)

    return this.write(message)
  }

  async broadcastActivity(activity: Activity): Promise<void> {
    this.wsServer.room(activity.pushTo()).write(activity.data())
  }

  async createMessageFromActivityEvent(event: ActivityEvent): Promise<WsOutMessage> {
    const user = await this.userService.getUserById(event.actorId)
    const space = await this.spaceService.getSpaceById(event.spaceId)
    const entity = await this.activityService.getEntityFromActivityEvent(event)

    return new WsOutMessage(event, user, space, entity)
  }

  private isSidebarRelated(message: WsOutMessage): boolean {
    switch (message.event.entity) {
      case ActivityType.Doc:
      case ActivityType.Node:
      case ActivityType.TaskBoard:
        return true
    }

    return false
  }

  private roomName(message: WsOutMessage): string {
    let roomName: string
    let roomNumber: number

    switch (message.event.entity) {
      case ActivityType.TaskList:
        roomName = ActivityType.TaskBoard
        roomNumber = message.entity.boardId
        break
      case ActivityType.Task:
        roomName = ActivityType.TaskBoard
        roomNumber = message.entity.boardId
        break

      default:
        roomName = message.event.entity
        roomNumber = message.event.entityId
        break
    }

    return `${message.space.id}.${roomName}.${roomNumber}`
  }

  private shouldBroadcast(event: ActivityEvent): boolean {
    switch (event.entity) {
      case ActivityType.PasswordReset:
        return false
    }

    return true
  }

  private write(message: WsOutMessage): void {
    if (this.isSidebarRelated(message)) {
      const sideBarRoom = `${message.space.id}.Sidebar`
      this.wsServer.room(sideBarRoom).write({ message })
    }

    const roomName = this.roomName(message)
    this.wsServer.room(roomName).write({ message })

    // Test: send all activities
    const activitiesRoom = `${message.space.id}.Activity`
    this.wsServer.room(activitiesRoom).write({ message })
  }
}
