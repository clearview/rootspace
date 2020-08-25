import { User } from '../../database/entities/User'
import { Space } from '../../database/entities/Space'
import { ActivityEvent } from '../events/ActivityEvent'

export class OutMessage {
  event: ActivityEvent
  space: Space
  user: User
  entity: any

  constructor(event: ActivityEvent, user: User, space: Space, entity: any) {
    this.event = event
    this.space = space
    this.user = user
    this.entity = entity
  }
}