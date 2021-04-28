import { getCustomRepository } from 'typeorm'
import { ContentAccessRepository } from '../../database/repositories/ContentAccessRepository'
import { ContentAccess } from '../../database/entities/ContentAccess'
import { Node } from '../../database/entities/Node'
import { ContentAccessCreateValue, ContentAccessUpdateValue } from './values'
import { ContentAccessType } from './ContentAccessType'
import { ContentEntity } from '../../root/types'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { ContentEntityNames, NodeTypeEntityNameMap } from '../../shared/constants'

export class ContentAccessService {
  private static instance: ContentAccessService

  static getInstance() {
    if (!ContentAccessService.instance) {
      ContentAccessService.instance = new ContentAccessService()
    }

    return ContentAccessService.instance
  }

  private getRepository(): ContentAccessRepository {
    return getCustomRepository(ContentAccessRepository)
  }

  getById(id: number): Promise<ContentAccess> {
    return this.getRepository().findOne(id)
  }

  async requireById(id: number): Promise<ContentAccess> {
    const contentAccess = this.getById(id)

    if (contentAccess) {
      return this.getRepository().findOne(id)
    }

    throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
  }

  getForEntity(entity: ContentEntity): Promise<ContentAccess> {
    const entityName = entity.constructor.name

    if (ContentEntityNames.has(entityName) === false) {
      throw new Error('Invalid content entity name')
    }

    return this.getRepository().getByEntityIdAndName(entity.id, entityName)
  }

  async requireForEntity(entity: ContentEntity): Promise<ContentAccess> {
    const contentAccess = (await this.getForEntity(entity)) ?? this.createDefault(entity)
    return contentAccess
  }

  async createDefault(entity: ContentEntity): Promise<ContentAccess> {
    const entityName = entity.constructor.name

    if (ContentEntityNames.has(entityName) === false) {
      throw new Error('Invalid content entity name')
    }

    return this.create(
      ContentAccessCreateValue.fromObject({
        spaceId: entity.spaceId,
        ownerId: entity.userId,
        entityId: entity.id,
        entity: entityName,
        type: ContentAccessType.Open,
        public: false,
      })
    )
  }

  async create(data: ContentAccessCreateValue): Promise<ContentAccess> {
    return await this.getRepository().save(data.attributes)
  }

  async update(data: ContentAccessUpdateValue, id: number) {
    const contentAccess = await this.requireById(id)

    Object.assign(contentAccess, data.attributes)
    await this.getRepository().save(contentAccess)

    return contentAccess
  }

  async remove(target: number | ContentAccess): Promise<ContentAccess> {
    const access = typeof target === 'number' ? await this.getById(target) : target
    return this.getRepository().remove(access)
  }

  async removeForEntity(entity: ContentEntity): Promise<ContentAccess> {
    const contentAccess = await this.getForEntity(entity)
    return this.remove(contentAccess)
  }
}
