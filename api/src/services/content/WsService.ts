import { Request } from 'express'
import { WsOutAction, WssInterface } from './contracts'
import { OutMessage } from '../models/OutMessage'
import { UserService } from '../UserService'
import { SpaceService } from '../SpaceService'
import { PrimusRooms } from '../../declarations/PrimusRooms'

export class WsService implements WssInterface<any> {
  private static instance: WsService
  private server: PrimusRooms
  private userService: UserService
  private spaceService: SpaceService

  static fromRequest(req: Request) {
    if (!WsService.instance) {
      WsService.instance = new WsService()
      WsService.instance.server = req.app.get('wss')
      WsService.instance.userService = UserService.getInstance()
      WsService.instance.spaceService = SpaceService.getInstance()
    }

    return WsService.instance
  }

  write(data: OutMessage): void {
    return this.server.room(data.space.id).write({message: data})
  }

  async onCreated(entity: any): Promise<void> {
    const message = await this.createMessageFromEntity(WsOutAction.Created, entity)
    return this.write(message)
  }

  async createMessageFromEntity(action: WsOutAction, entity: any): Promise<OutMessage> {
    const user = await this.userService.getUserById(entity.userId)
    const space = await this.spaceService.getSpaceById(entity.spaceId)

    return new OutMessage(action, user, space, entity)
  }
}
