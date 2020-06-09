import { EntityRepository, Repository } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { Space } from '../entities/Space'

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
  getByUserId(userId: number) {
    return this.createQueryBuilder('spaces')
      .innerJoin(UserToSpace, 'userToSpace', 'userToSpace.spaceId = spaces.id')
      .where('userToSpace.userId = :userId AND userToSpace.active = true', {
        userId,
      })
      .getMany()
  }
}
