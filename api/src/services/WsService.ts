import { UserService } from './UserService'
import { SpaceService } from './SpaceService'
import { PrimusRooms } from '../declarations/PrimusRooms'
import { ActivityEvent } from './events/ActivityEvent'
import { ActivityService } from './ActivityService'
import { OutMessage } from './models/OutMessage'
import Server from '../server'
import { ActivityType } from '../types/activity'
import { WsEventEmitter } from './events/WsEventEmitter'
import { WsEvent } from './events/WsEvent'

export class WsService {
  private static instance: WsService
  private wsEventEmitter: WsEventEmitter
  private wsServer: PrimusRooms
  private userService: UserService
  private spaceService: SpaceService
  private activityService: ActivityService

  static initFromServer() {
    if (!WsService.instance) {
      WsService.instance = new WsService()
      WsService.instance.wsEventEmitter = WsEventEmitter.getInstance()
      WsService.instance.wsServer = Server.getInstance().wsServer as PrimusRooms
      WsService.instance.userService = UserService.getInstance()
      WsService.instance.spaceService = SpaceService.getInstance()
      WsService.instance.activityService = ActivityService.getInstance()

      WsService.instance.wsEventEmitter.on(WsEvent.NAME, async (event: ActivityEvent) => {
        await WsService.instance.broadcast(event)
      })
    }

    return WsService.instance
  }

  async broadcast(event: ActivityEvent): Promise<void> {
    if (!this.shouldBroadcast(event)) {
      return null
    }

    const message = await this.createMessageFromActivityEvent(event)

    return this.write(message)
  }

  async createMessageFromActivityEvent(event: ActivityEvent): Promise<OutMessage> {
    const user = await this.userService.getUserById(event.actorId)
    const space = await this.spaceService.getSpaceById(event.spaceId)
    const entity = await this.activityService.getEntityFromActivityEvent(event)

    return new OutMessage(event, user, space, entity)
  }

  private isSidebarRelated(message: OutMessage): boolean {
    switch (message.event.entity) {
      case ActivityType.Doc:
      case ActivityType.Node:
      case ActivityType.TaskBoard:
        return true
    }

    return false
  }

  private roomName(message: OutMessage): string {
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

  private write(message: OutMessage): void {
    if (this.isSidebarRelated(message)) {
      const sideBarRoom = `${message.space.id}.Sidebar`
      this.wsServer.room(sideBarRoom).write({message})
    }

    const roomName = this.roomName(message)
    this.wsServer.room(roomName).write({message})

    // Test: send all activities
    const activitiesRoom = `${message.space.id}.Activity`
    this.wsServer.room(activitiesRoom).write({message})
  }
}
