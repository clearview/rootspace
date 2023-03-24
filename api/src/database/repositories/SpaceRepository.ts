import { EntityRepository, Repository, UpdateResult, SelectQueryBuilder } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { Space } from '../entities/Space'
import { Upload } from '../entities/Upload'
import { QueryOptions } from '../../shared/types/DBQueryOptions'

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
  getByUserId(userId: number, filter: {} = {}, optiosn: QueryOptions = {}) {
    const queryBuilder = this.createQueryBuilder('spaces')
      .innerJoin(UserToSpace, 'userToSpace', 'userToSpace.spaceId = spaces.id')
      .where('userToSpace.userId = :userId AND userToSpace.active = true', {
        userId,
      })

    this.mapLogo(queryBuilder)

    return queryBuilder.getMany()
  }

  async getJointByUsers(userId1: number, userId2: number): Promise<Space[]> {
    return this.createQueryBuilder('space')
      .where(new UserToSpace())
      .innerJoin(UserToSpace, 'userSpace1', 'space.id = userSpace1.spaceId AND userSpace1.userId = :userId1', {
        userId1,
      })
      .innerJoin(UserToSpace, 'userSpace2', 'space.id = userSpace2.spaceId AND userSpace2.userId = :userId2', {
        userId2,
      })
      .getMany()
  }

  updateCountMembers(spaceId: number, count: number): Promise<UpdateResult> {
    return this.update(spaceId, { countMembers: count })
  }

  private mapLogo(queryBuilder: SelectQueryBuilder<Space>): SelectQueryBuilder<Space> {
    const alias = queryBuilder.alias

    return queryBuilder.leftJoinAndMapOne(
      alias + '.avatar',
      Upload,
      'upload',
      'upload.entityId = ' + alias + '.id AND upload.entity = :entity',
      {
        entity: 'Space',
      }
    )
  }
}
