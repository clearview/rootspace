import { EntityRepository, Repository, DeleteResult } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {
  setInactive(userId: number, spaceId: number): Promise<DeleteResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        active: false,
      })
      .where('userId = :userId AND spaceId = :spaceId', { userId, spaceId })
      .execute()
  }
}
