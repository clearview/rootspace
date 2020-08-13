import { EntityRepository, Repository } from 'typeorm'
import { Space } from '../entities/Space'
import { UserSetting } from '../entities/UserSetting'

@EntityRepository(Space)
export class UserSettingRepository extends Repository<UserSetting> {
  async getOne(userId: number, spaceId?: number): Promise<UserSetting> {
    const queryBuilder = this.createQueryBuilder('userSetting')
      .where('userSetting.userId = :userId', { userId })

      if (spaceId) {
        queryBuilder
          .andWhere('userSetting.spaceId = :spaceId', { spaceId })
      } else {
        queryBuilder
          .andWhere('userSetting.spaceId IS NULL')
      }

      return queryBuilder.getOne()
  }
}
