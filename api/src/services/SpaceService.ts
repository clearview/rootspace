import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../database/repositories/SpaceRepository'
import { Space } from '../database/entities/Space'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'

export class SpaceService {
  private static instance: SpaceService

  static getInstance() {
    if (!SpaceService.instance) {
      SpaceService.instance = new SpaceService()
    }

    return SpaceService.instance
  }

  getSpaceRepository(): SpaceRepository {
    return getCustomRepository(SpaceRepository)
  }

  getSpaceById(id: number): Promise<Space | undefined> {
    return this.getSpaceRepository().findOne(id)
  }

  async requireSpaceById(id: number): Promise<Space> {
    const space = await this.getSpaceById(id)

    if (!space) {
      throw clientError('Can not find space id ' + id, HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return space
  }

  getSpacesByUserId(userId: number): Promise<Space[]> {
    return this.getSpaceRepository().getByUserId(userId)
  }

  async getSpacesJointByUsers(userId1: number, userId2: number): Promise<Space[]> {
    return this.getSpaceRepository().getJointByUsers(userId1, userId2)
  }

  async create(data: SpaceCreateValue): Promise<Space> {
    const space = this.getSpaceRepository().create(data.attributes)
    return await this.getSpaceRepository().save(space)
  }

  async update(data: SpaceUpdateValue, id: number): Promise<Space> {
    const space = await this.getSpaceRepository().findOne(id)

    if (!space) {
      throw clientError('Invalid request')
    }

    Object.assign(space, data.attributes)
    return this.getSpaceRepository().save(space)
  }
}
