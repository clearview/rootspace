import {EntityRepository, Repository} from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import {Space} from '../entities/Space'

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {

  getByUserId(userId: number) {
    return this.createQueryBuilder('spaces')
      .select(['spaces.id', 'spaces.title', 'spaces.settings'])
      .leftJoin(UserToSpace, 'userToSpace', 'userToSpace.spaceId = spaces.id')
      .where('userToSpace.userId = :userId AND spaces.active = true', { userId })
      .getMany()
  }
}