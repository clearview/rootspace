import { getCustomRepository, DeleteResult } from 'typeorm'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { UserToSpace } from '../entities/UserToSpace'
import { UserSignupValidator } from '../validation/user/UserSignupValidator'

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

  add(userId: number, spaceId: number): Promise<UserToSpace> {
    const userToSpace = new UserToSpace()
    userToSpace.userId = userId
    userToSpace.spaceId = spaceId
    userToSpace.active = true

    return this.getUserToSpaceRepository().save(userToSpace)
  }

  remove(userId: number, spaceId: number): Promise<DeleteResult> {
    return this.getUserToSpaceRepository().setInactive(userId, spaceId)
  }
}
