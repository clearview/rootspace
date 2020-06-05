import { getCustomRepository, DeleteResult } from 'typeorm'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { UserToSpace } from '../entities/UserToSpace'
import { clientError, ClientErrName } from '../errors/client'

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

  getByUserIdAndSpaceId(userId: number, spaceId: number): Promise<UserToSpace> {
    return this.getUserToSpaceRepository().getByUserIdAndSpaceId(
      userId,
      spaceId
    )
  }

  getCountSpaceUsers(spaceId: number): Promise<number> {
    return this.getUserToSpaceRepository().getCountUsersBySpaceId(spaceId)
  }

  async isUserInSpace(userId: number, spaceId: number): Promise<boolean> {
    const userSpace = await this.getByUserIdAndSpaceId(userId, spaceId)

    if (userSpace && userSpace.active === true) {
      return true
    }

    return false
  }

  async add(userId: number, spaceId: number): Promise<UserToSpace> {
    if (true === (await this.isUserInSpace(userId, spaceId))) {
      throw clientError('User is already in space', ClientErrName.NotAllowed)
    }

    const userToSpace = new UserToSpace()
    userToSpace.userId = userId
    userToSpace.spaceId = spaceId

    return this.getUserToSpaceRepository().save(userToSpace)
  }

  remove(userId: number, spaceId: number): Promise<DeleteResult> {
    return this.getUserToSpaceRepository().setInactive(userId, spaceId)
  }
}
