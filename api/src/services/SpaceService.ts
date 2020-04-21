import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { Space } from '../entities/Space'
import { ISpaceProvider } from '../types/space'

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

  async create(data: ISpaceProvider): Promise<Space> {
    try {
      let space = this.getSpaceRepository().create(data)
      space = await this.getSpaceRepository().save(space)

      let userToSpace = this.getUserToSpaceRepository().create({
        userId: data.userId,
        spaceId: space.id,
      })

      userToSpace = await this.getUserToSpaceRepository().save(userToSpace)

      return space
    } catch (err) {
      throw err
    }
  }
}
