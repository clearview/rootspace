import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber,
} from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { SpaceFacade } from '../../services/facade'

@EventSubscriber()
export class UserToSpaceSubscriber
    implements EntitySubscriberInterface<UserToSpace> {
  spaceFacade: SpaceFacade

  constructor() {
    this.spaceFacade = new SpaceFacade()
  }

  listenTo() {
    return UserToSpace
  }

  async afterInsert(event: InsertEvent<UserToSpace>) {
    return this.spaceFacade.updateSpaceCountMembers(event.entity.spaceId)
  }
}
