import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { Space } from '../entities/Space'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { clientError } from '../errors/client'
import { UserToSpace } from '../entities/UserToSpace'

export class SpaceService {
  getSpaceRepository(): SpaceRepository {
    return getCustomRepository(SpaceRepository)
  }

  getUserToSpaceRepository(): UserToSpaceRepository {
    return getCustomRepository(UserToSpaceRepository)
  }

  getSpaceById(id: number): Promise<Space | undefined> {
    return this.getSpaceRepository().findOne(id)
  }

  async isUserInSpace(userId: number, spaceId: number): Promise<boolean> {
    const space = await this.getSpaceRepository().getByIdAndUserId(
      spaceId,
      userId
    )

    if (space && space !== undefined) {
      return true
    }

    return false
  }

  async create(data: SpaceCreateValue): Promise<Space> {
    try {
      let space = this.getSpaceRepository().create(data.getAttributes())
      space = await this.getSpaceRepository().save(space)

      let userToSpace = this.getUserToSpaceRepository().create({
        userId: space.userId,
        spaceId: space.id,
      })

      userToSpace = await this.getUserToSpaceRepository().save(userToSpace)

      return space
    } catch (err) {
      throw err
    }
  }

  async update(data: SpaceUpdateValue, id: number): Promise<Space> {
    const space = await this.getSpaceRepository().findOne(id)

    if (!space) {
      throw clientError('Invalid request')
    }

    Object.assign(space, data.getAttributes())
    return this.getSpaceRepository().save(space)
  }
}
