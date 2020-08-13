import { EntityRepository, Repository } from 'typeorm'
import { UserSetting } from '../entities/UserSetting'

@EntityRepository(UserSetting)
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
