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

  private write(message: OutMessage): void {
    if (this.isSidebarRelated(message)) {
      const sideBarRoom = `SideBar-${message.space.id}`
      this.wsServer.room(sideBarRoom).write({message})
    }

    const entityRoom = `${message.event.entity}-${message.event.entityId}`
    this.wsServer.room(entityRoom).write({message})

    // Test: send all activities
    const activitiesRoom = `Activity-${message.space.id}`
    this.wsServer.room(activitiesRoom).write({message})
  }
}
