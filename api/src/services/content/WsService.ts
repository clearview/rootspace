import { Request } from 'express'
import { WsAction, WssInterface } from './contracts'
import { Message } from '../models/Message'
import { UserService } from '../UserService'
import { SpaceService } from '../SpaceService'
import Primus = require('primus')

export class WsService implements WssInterface<any> {
  private static instance: WsService
  private server: Primus
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

  write(data: any): void {
    return this.server.write(data)
  }

  async onCreated(entity: any): Promise<void> {
    const message = await this.createMessageFromEntity(WsAction.Created, entity)
    return this.write(message)
  }

  async createMessageFromEntity(action: WsAction, entity: any): Promise<Message> {
    const user = await this.userService.getUserById(entity.userId)
    const space = await this.spaceService.getSpaceById(entity.spaceId)

    return new Message(action, user, space, entity)
  }
}
