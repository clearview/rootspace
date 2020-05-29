import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber,
} from 'typeorm'
import { UserToSpace } from '../UserToSpace'
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
    this.spaceFacade.updateSpaceMembersCount(event.entity.spaceId)
  }
}
