import { getCustomRepository } from 'typeorm'
import { ContentAccessRepository } from '../../database/repositories/ContentAccessRepository'
import { ContentAccess } from '../../database/entities/ContentAccess'
import { ContentAccessCreateValue, ContentAccessUpdateValue } from './values'
import { ContentAccessType } from './ContentAccessType'
import { ContentEntity } from '../../root/types'
import { Activity, EntityActivity, ActivityType } from '../activity/activities'
import { ContentActions } from '../activity/activities/content/actions'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { IActivityObserver } from '../contracts'

export class ContentAccessService implements IActivityObserver {
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

  async activityNotification(activity: Activity): Promise<void> {
    if (activity.type() !== ActivityType.Content) {
      return
    }

    const contentActivity = activity as EntityActivity<ContentEntity>

    if (contentActivity.action() === ContentActions.Created) {
      const entity = contentActivity.entity()

      await this.create(
        ContentAccessCreateValue.fromObject({
          spaceId: entity.spaceId,
          ownerId: entity.userId,
          entityId: entity.id,
          entity: contentActivity.getEntityName(),
          type: ContentAccessType.Open,
          public: false,
        })
      )
    }

    if (contentActivity.action() === ContentActions.Deleted) {
      const contentAccess = await this.getForEntity(contentActivity.entity().id, contentActivity.getEntityName())
      await this.remove(contentAccess)
    }
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

  getForEntity(entityId: number, entity: string): Promise<ContentAccess> {
    return this.getRepository().getForEntity(entityId, entity)
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

  async remove(contentAccess: number): Promise<ContentAccess>
  async remove(contentAccess: ContentAccess): Promise<ContentAccess>
  async remove(contentAccess: any): Promise<ContentAccess> {
    if (typeof contentAccess === 'number') {
      const access = await this.getById(contentAccess)
      return this.getRepository().remove(access)
    }

    const access = contentAccess as ContentAccess
    return this.getRepository().remove(access)
  }
}
