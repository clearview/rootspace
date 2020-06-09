import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { Space } from '../entities/Space'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { clientError, ClientErrName, ClientStatusCode } from '../errors/client'

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
      throw clientError(
        'Can not find space id ' + id,
        ClientErrName.EntityNotFound,
        ClientStatusCode.NotFound
      )
    }

    return space
  }

  getSpacesByUserId(userId: number): Promise<Space[]> {
    return this.getSpaceRepository().getByUserId(userId)
  }

  async create(data: SpaceCreateValue): Promise<Space> {
    const space = this.getSpaceRepository().create(data.getAttributes())
    return await this.getSpaceRepository().save(space)
  }

  async update(data: SpaceUpdateValue, id: number): Promise<Space> {
    const space = await this.getSpaceRepository().findOne(id)

    if (!space) {
      throw clientError('Invalid request')
    }

    Object.assign(space, data.getAttributes())
    return this.getSpaceRepository().save(space)
  }

  async updateCountMembers(count: number, spaceId: number): Promise<Space> {
    const space = await this.getSpaceById(spaceId)

    if (!space) {
      throw clientError(
        'Space not found ' + spaceId,
        ClientErrName.EntityNotFound,
        ClientStatusCode.NotFound
      )
    }

    space.countMembers = count
    return this.getSpaceRepository().save(space)
  }
}
