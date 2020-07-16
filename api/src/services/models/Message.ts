import { WsAction } from '../content/contracts'
import { User } from '../../database/entities/User'
import { Space } from '../../database/entities/Space'

export class Message {
  private action: WsAction
  private target: string
  private space: Space
  private user: User
  private object: any

  constructor(action: WsAction, user: User, space: Space, entity: any) {
    this.action = action
    this.target = entity.constructor.name
    this.space = space
    this.user = user
    this.object = entity
  }
}