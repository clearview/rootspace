import { WsInAction } from '../events/WsInAction'
import { User } from '../../database/entities/User'

export class InMessage {
  action: WsInAction
  user?: User
  room?: string

  constructor(action: WsInAction, user?: User, room?: string) {
    this.action = action
    this.user = user
    this.room = room
  }
}