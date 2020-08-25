import { WssInterface } from './contracts'
import { UserService } from '../UserService'
import { SpaceService } from '../SpaceService'
import { PrimusRooms } from '../../declarations/PrimusRooms'
import { ActivityEvent } from '../events/ActivityEvent'
import { ActivityService } from '../ActivityService'
import { OutMessage } from '../models/OutMessage'
import Server from '../../server'
import { ActivityType } from '../../types/activity'

export class WsService implements WssInterface<any> {
  private static instance: WsService
  private wsServer: PrimusRooms
  private userService: UserService
  private spaceService: SpaceService
  private activityService: ActivityService

  static fromServer() {
    if (!WsService.instance) {
      WsService.instance = new WsService()
      WsService.instance.wsServer = Server.getInstance().wsServer as PrimusRooms
      WsService.instance.userService = UserService.getInstance()
      WsService.instance.spaceService = SpaceService.getInstance()
      WsService.instance.activityService = ActivityService.getInstance()
    }

    return WsService.instance
  }

  /**
   * Connect from different thread (worker)?
   * https://github.com/primus/primus#connecting-from-the-server
   */
  static fromWorker() {
    if (!WsService.instance) {
      // NOT TESTED
      // const PrimusSocket = this.wsServer.Socket
      // const client = new PrimusSocket('http://localhost:3001')
      //
      // client.write({
      //   action: 'echo',
      //   data: 'test from node'
      // })
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
    const entity = await this.activityService.getEntityFromActivity(event)

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

  /**
   * Todo: add boardId to task table in order to get board id for room number!!!
   */
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
        roomNumber = 0 // message.entity.boardId
        break

      default:
        roomName = message.event.entity
        roomNumber = message.event.entityId
        break
    }

    return `${roomName}-${roomNumber}`
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
      const sideBarRoom = `SideBar-${message.space.id}`
      this.wsServer.room(sideBarRoom).write({message})
    }

    const roomName = this.roomName(message)
    this.wsServer.room(roomName).write({message})

    // Test: send all activities
    const activitiesRoom = `Activity-${message.space.id}`
    this.wsServer.room(activitiesRoom).write({message})
  }
}
