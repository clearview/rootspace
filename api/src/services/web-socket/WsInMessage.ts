import { User } from '../../database/entities/User'

export const WsInAction = {
  Echo: 'echo',
  Join: 'join',
  List: 'list',
  Leave: 'leave',
  LeaveAll: 'leaveAll',
}

export class WsInMessage {
  action: string
  user?: User
  room?: string

  constructor(action: string, user?: User, room?: string) {
    this.action = action
    this.user = user
    this.room = room
  }
}
