import { getCustomRepository } from 'typeorm'
import { ContentAccessRepository } from '../../database/repositories/ContentAccessRepository'
import { ContentAccess } from '../../database/entities/ContentAccess'
import { Service } from '..'
import { ContentAccessUpdateValue } from './values'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'

export class ContentAccessService extends Service {
  private static instance: ContentAccessService

  static getInstance() {
    if (!ContentAccessService.instance) {
      ContentAccessService.instance = new ContentAccessService()
    }

    return ContentAccessService.instance
  }

  private constructor() {
    super()
  }

  private getRepository(): ContentAccessRepository {
    return getCustomRepository(ContentAccessRepository)
  }

  getById(id: number): Promise<ContentAccess> {
    const contentAccess = this.requireById(id)

    if (contentAccess) {
      return this.getRepository().findOne(id)
    }

    clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
  }

  async requireById(id: number): Promise<ContentAccess> {
    return this.getRepository().findOne(id)
  }

  getForEntity(entityId: number, entity: string): Promise<ContentAccess> {
    return this.getRepository().getForEntity(entityId, entity)
  }

  async update(data: ContentAccessUpdateValue, id: number) {
    const contentAccess = await this.requireById(id)

    Object.assign(contentAccess, data.attributes)
    await this.getRepository().save(contentAccess)

    return contentAccess
  }
}
