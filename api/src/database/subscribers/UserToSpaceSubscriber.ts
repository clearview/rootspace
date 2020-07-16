import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber,
} from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { SpaceRepository } from '../../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../../repositories/UserToSpaceRepository'

@EventSubscriber()
export class UserToSpaceSubscriber
  implements EntitySubscriberInterface<UserToSpace> {
  listenTo() {
    return UserToSpace
  }

  async afterInsert(event: InsertEvent<UserToSpace>) {
    const entity = event.entity

    const membersCount = await event.manager
      .getCustomRepository(UserToSpaceRepository)
      .getCountUsersBySpaceId(entity.spaceId)

    await event.manager
      .getCustomRepository(SpaceRepository)
      .updateCountMembers(entity.spaceId, membersCount)
  }
}
