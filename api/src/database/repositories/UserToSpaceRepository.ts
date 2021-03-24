import { EntityRepository, Repository, UpdateResult } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'
import { User } from '../entities/User'

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {
  getByUserId(userId: number, filter: { active?: boolean } = {}) {
    const query = this.createQueryBuilder('userSpace').where('userSpace.userId = :userId', { userId })

    if (filter.active !== undefined) {
      query.andWhere('userSpace.active = :active', { active: filter.active })
    }

    return query.getMany()
  }

  getByUserIdAndSpaceId(
    userId: number,
    spaceId: number,
    filter: { active?: boolean } = {}
  ): Promise<UserToSpace | undefined> {
    const query = this.createQueryBuilder('userSpace').where(
      'userSpace.userId = :userId AND userSpace.spaceId = :spaceId',
      {
        userId,
        spaceId,
      }
    )

    if (filter.active !== undefined) {
      query.andWhere('userSpace.active = :active', { active: filter.active })
    }

    return query.getOne()
  }

  getByUserEmailAndSpaceId(email: string, spaceId: number, filter: any = {}): Promise<UserToSpace | undefined> {
    const query = this.createQueryBuilder('userSpace')
      .innerJoin(User, 'user', 'user.id = userSpace.userId')
      .where('user.email = :email', { email })
      .andWhere('userSpace.spaceId = :spaceId', { spaceId })

    if (filter.active !== undefined) {
      query.andWhere('userSpace.active = :active', { active: filter.active })
    }

    return query.getOne()
  }

  async getCountUsersBySpaceId(spaceId: number): Promise<number> {
    return this.createQueryBuilder('userSpace')
      .where('userSpace.spaceId = :spaceId AND userSpace.active = true', {
        spaceId,
      })
      .getCount()
  }

  setInactive(userId: number, spaceId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        active: false,
      })
      .where('userId = :userId AND spaceId = :spaceId', { userId, spaceId })
      .execute()
  }
}
