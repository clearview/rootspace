import { EntityRepository, Repository, UpdateResult, SelectQueryBuilder } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { Space } from '../entities/Space'
import { Upload } from '../entities/Upload'

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
  getByUserId(userId: number) {
    const queryBuilder = this.createQueryBuilder('spaces')
      .innerJoin(UserToSpace, 'userToSpace', 'userToSpace.spaceId = spaces.id')
      .where('userToSpace.userId = :userId AND userToSpace.active = true', {
        userId,
      })

    this.mapLogo(queryBuilder)

    return queryBuilder.getMany()
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
