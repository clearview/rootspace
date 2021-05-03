import { getCustomRepository } from 'typeorm'
import { UserToSpaceRepository } from '../../database/repositories/UserToSpaceRepository'
import { UserToSpace } from '../../database/entities/UserToSpace'
import { clientError, HttpErrName } from '../../response/errors'
import { SpaceUserUpdateValue } from './values'
import { SpaceUserRole } from './SpaceUserRole'

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

  getByUserId(userId: number, filter: { active?: boolean } = {}): Promise<UserToSpace[]> {
    return this.getUserToSpaceRepository().getByUserId(userId, filter)
  }

  getByUserIdAndSpaceId(userId: number, spaceId: number, filter: { active?: boolean } = {}): Promise<UserToSpace> {
    return this.getUserToSpaceRepository().getByUserIdAndSpaceId(userId, spaceId, filter)
  }

  async requireByUserIdAndSpaceId(
    userId: number,
    spaceId: number,
    filter: { active?: boolean } = {}
  ): Promise<UserToSpace> {
    const userSpace = await this.getByUserIdAndSpaceId(userId, spaceId, filter)

    if (!userSpace) {
      throw clientError('Not found', HttpErrName.EntityNotFound)
    }

    return userSpace
  }

  async isUserInSpace(userId: number, spaceId: number): Promise<boolean> {
    const userSpace = await this.getByUserIdAndSpaceId(userId, spaceId, { active: true })
    return !!userSpace
  }

  async isEmailInSpace(email: string, spaceId: number): Promise<boolean> {
    const userSpace = await this.getUserToSpaceRepository().getByUserEmailAndSpaceId(email, spaceId, { active: true })
    return !!userSpace
  }

  async add(userId: number, spaceId: number, role: number = SpaceUserRole.Member): Promise<UserToSpace> {
    if (true === (await this.isUserInSpace(userId, spaceId))) {
      throw clientError('User is already in space', HttpErrName.NotAllowed)
    }

    const userToSpace = new UserToSpace()
    userToSpace.userId = userId
    userToSpace.spaceId = spaceId
    userToSpace.role = role

    return this.getUserToSpaceRepository().save(userToSpace)
  }

  async remove(entity: UserToSpace): Promise<UserToSpace>
  async remove(userId: number, spaceId: number): Promise<UserToSpace>
  async remove(entityOrId: UserToSpace | number, spaceId?: number): Promise<UserToSpace> {
    const userToSpace =
      typeof entityOrId === 'number'
        ? await this.getByUserIdAndSpaceId(entityOrId, spaceId, { active: true })
        : entityOrId

    userToSpace.active = false

    return this.getUserToSpaceRepository().save(userToSpace)
  }

  async update(data: SpaceUserUpdateValue, userId: number, spaceId: number): Promise<UserToSpace> {
    const userToSpace = await this.requireByUserIdAndSpaceId(userId, spaceId, { active: true })
    Object.assign(userToSpace, data.attributes)
    return this.getUserToSpaceRepository().save(userToSpace)
  }
}
