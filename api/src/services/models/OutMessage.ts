import { WsOutAction } from '../content/contracts'
import { User } from '../../database/entities/User'
import { Space } from '../../database/entities/Space'

export class OutMessage {
  action: WsOutAction
  target: string
  space: Space
  user: User
  object: any

  constructor(action: WsOutAction, user: User, space: Space, entity: any) {
    this.action = action
    this.target = entity.constructor.name
    this.space = space
    this.user = user
    this.object = entity
  }
}