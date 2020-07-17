import { EntityRepository, Repository, UpdateResult } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {
  getByUserIdAndSpaceId(
    userId: number,
    spaceId: number
  ): Promise<UserToSpace | undefined> {
    return this.createQueryBuilder('userSpace')
      .where('userSpace.userId = :userId AND userSpace.spaceId = :spaceId', {
        userId,
        spaceId,
      })
      .getOne()
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
