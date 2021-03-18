import { EntityRepository, SelectQueryBuilder } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Upload } from '../entities/Upload'
import { User } from '../entities/User'
import { Activity } from '../entities/Activity'
import { Notification } from '../entities/Notification'

@EntityRepository(Activity)
export class ActivityRepository extends BaseRepository<Activity> {
  async getBySpaceId(spaceId: number, filter: any = {}, options: any = {}): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.actor', 'user')
      .where('activity.spaceId = :spaceId', { spaceId })

    this.mapActivityActorAvatar(queryBuilder)

    if (filter.userId) {
      queryBuilder.andWhere('activity.actorId = :userId', { userId: filter.userId })
    }

    if (filter.action) {
      queryBuilder.andWhere('activity.action = :action', { action: filter.action })
    }

    if (filter.type) {
      queryBuilder.andWhere('activity.type = :type', { type: filter.type })
    }

    if (filter.entity) {
      queryBuilder.andWhere('activity.entity IN (:...entity)', { entity: filter.entity })
    }

    if (options.offset) {
      queryBuilder.offset(options.offset)
    }

    const limit = options.limit ?? 50
    queryBuilder.limit(limit)

    return queryBuilder.orderBy('activity.createdAt', 'DESC').getMany()
  }

  async getByEntity(entity: string, entityId: number, options: any = {}): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')

    this.mapActivityActorAvatar(queryBuilder)

    queryBuilder.where('activity.entity = :entity', { entity }).andWhere('activity.entityId = :entityId', { entityId })

    if (options.offset) {
      queryBuilder.offset(options.offset)
    }

    const limit = options.limit ?? 50
    queryBuilder.limit(limit)

    return queryBuilder.orderBy('activity.createdAt', 'DESC').getMany()
  }

  getByActorId(actorId: number, filter: any = {}): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')
      .where('activity.actorId = :actorId', { actorId })
      .orderBy('activity.createdAt', 'DESC')
      .limit(50)

    if (filter.spaceIds) {
      queryBuilder.andWhere('activity.spaceId IN (:...spaceIds)', { spaceIds: filter.spaceIds })
    }

    return queryBuilder.getMany()
  }

  getUserNotify(userId: number, spaceId: number, filter: any = {}, options: any = {}): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')

    this.mapActivityActorAvatar(queryBuilder)

    queryBuilder
      .innerJoinAndMapOne('activity.notification', Notification, 'notification', 'activity.id = notification.activity')
      .orderBy('notification.createdAt', 'DESC')
      .where('activity.type = :type', { type: 'content' })
      .andWhere('activity.spaceId = :spaceId', { spaceId })

    if (filter.type) {
      queryBuilder.andWhere('activity.type = :type', { type: filter.type })
    }

    if (options.offset) {
      queryBuilder.offset(options.offset)
    }

    const limit = options.limit ?? 50
    queryBuilder.limit(limit)

    queryBuilder
      .andWhere('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = false')
      .limit(limit)

    return queryBuilder.getMany()
  }

  private mapActivityActorAvatar(queryBuilder: SelectQueryBuilder<Activity>): void {
    queryBuilder
      .leftJoinAndMapOne('activity.actor', User, 'actor', 'actor.id = activity.actorId')
      .leftJoinAndMapOne(
        'actor.avatar',
        Upload,
        'upload',
        'upload.entityId = activity.actorId and upload.entity = :uploadEntity',
        { uploadEntity: 'User' }
      )
  }
}
