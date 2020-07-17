import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber,
  EntityManager,
  UpdateEvent,
} from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'

@EventSubscriber()
export class UserToSpaceSubscriber
  implements EntitySubscriberInterface<UserToSpace> {
  listenTo() {
    return UserToSpace
  }

  async afterInsert(event: InsertEvent<UserToSpace>) {
    await this.updateSpaceCountMemebers(event.entity.spaceId, event.manager)
  }

  async afterUpdate(event: UpdateEvent<UserToSpace>) {
    await this.updateSpaceCountMemebers(event.entity.spaceId, event.manager)
  }

  private async updateSpaceCountMemebers(
    spaceId: number,
    manager: EntityManager
  ) {
    const membersCount = await manager
      .getCustomRepository(UserToSpaceRepository)
      .getCountUsersBySpaceId(spaceId)

    await manager
      .getCustomRepository(SpaceRepository)
      .updateCountMembers(spaceId, membersCount)
  }
}
