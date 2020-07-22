import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber,
  EntityManager,
  UpdateEvent, UpdateResult,
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

  async afterInsert(event: InsertEvent<UserToSpace>): Promise<UpdateResult> {
    return UserToSpaceSubscriber.updateSpaceCountMembers(event.entity.spaceId, event.manager)
  }

  async afterUpdate(event: UpdateEvent<UserToSpace>): Promise<UpdateResult> {
    return UserToSpaceSubscriber.updateSpaceCountMembers(event.entity.spaceId, event.manager)
  }

  private static async updateSpaceCountMembers(spaceId: number, manager: EntityManager): Promise<UpdateResult> {
    const membersCount = await manager
      .getCustomRepository(UserToSpaceRepository)
      .getCountUsersBySpaceId(spaceId)

    return manager
      .getCustomRepository(SpaceRepository)
      .updateCountMembers(spaceId, membersCount)
  }
}
