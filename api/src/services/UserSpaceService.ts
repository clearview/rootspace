import { getCustomRepository, DeleteResult } from 'typeorm'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { UserToSpace } from '../entities/UserToSpace'

export class UserSpaceService {
  private constructor() {}

  static instance: UserSpaceService

  static getInstance(): UserSpaceService {
    if (!UserSpaceService.instance) {
      UserSpaceService.instance = new UserSpaceService()
    }

    return UserSpaceService.instance
  }

  getUserToSpaceRepository(): UserToSpaceRepository {
    return getCustomRepository(UserToSpaceRepository)
  }

  getUsersCountBySpaceId(spaceId: number): Promise<number> {
    return this.getUserToSpaceRepository().getUsersCountBySpaceId(spaceId)
  }

  add(userId: number, spaceId: number): Promise<UserToSpace> {
    const userToSpace = new UserToSpace()
    userToSpace.userId = userId
    userToSpace.spaceId = spaceId

    return this.getUserToSpaceRepository().save(userToSpace)
  }

  remove(userId: number, spaceId: number): Promise<DeleteResult> {
    return this.getUserToSpaceRepository().setInactive(userId, spaceId)
  }
}
