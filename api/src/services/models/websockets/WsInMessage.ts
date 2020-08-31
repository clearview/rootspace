import { User } from '../../../database/entities/User'

export enum WsInAction {
  Echo = 'echo',
  Join = 'join',
  List = 'list',
  Leave = 'leave',
  LeaveAll = 'leaveAll'
}

export class WsInMessage {
  action: WsInAction
  user?: User
  room?: string

  constructor(action: WsInAction, user?: User, room?: string) {
    this.action = action
    this.user = user
    this.room = room
  }
}