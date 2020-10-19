import { EntityRepository, SelectQueryBuilder } from 'typeorm'
import { getConnection } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Activity } from '../entities/Activity'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { ActivityType } from '../../types/activity'
import { Upload } from '../entities/Upload'
import { User } from '../entities/User'
import { ucFirst } from '../../utils'

@EntityRepository(Activity)
export class ActivityRepository extends BaseRepository<Activity> {
  async getEntityFromActivityEvent(event: ActivityEvent): Promise<any> {
    return getConnection()
      .getRepository(event.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', { id: event.entityId })
      .getOne()
  }

  async getBySpaceId(spaceId: number, filter: any = {}): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.actor', 'user')
      .where('activity.spaceId = :spaceId', { spaceId })

    if (filter.action) {
      queryBuilder.andWhere('activity.action = :action', { action: filter.action })
    }

    if (filter.type) {
      queryBuilder.andWhere('activity.type = :type', { type: filter.type })
    }

    const results = await queryBuilder
      .limit(100)
      .orderBy('activity.createdAt', 'DESC')
      .getMany()

    results.forEach((result) => {
      Object.keys(result).forEach((index) => !result[index] && result[index] !== undefined && delete result[index])
    })

    return results
  }

  getByActorId(actorId: number, filter: any = {}): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')
      .where('activity.actorId = :actorId', { actorId })
      .orderBy('activity.createdAt', 'DESC')
      .limit(30)

    if (filter.spaceIds) {
      queryBuilder.andWhere('activity.spaceId IN (:...spaceIds)', { spaceIds: filter.spaceIds })
    }

    return queryBuilder.getMany()
  }

  getUserNotify(userId: number, spaceId: number): Promise<Activity[]> {
    const queryBuilder = this.createQueryBuilder('activity')

    this.mapActivityActorAvatar(queryBuilder)

    queryBuilder
      .innerJoin('notifications', 'notification', 'activity.id = notification.activity')
      .orderBy('notification.createdAt', 'DESC')
      .where('activity.type = :type', { type: 'content' })
      .andWhere('activity.spaceId = :spaceId', { spaceId })
      .andWhere('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = false')
      .limit(30)

    return queryBuilder.getMany()
  }

  async getByEntity(entity: string, entityId: number): Promise<Activity[]> {
    entity = ActivityRepository.getEntity(entity)

    const queryBuilder = this.createQueryBuilder('activity')

    this.mapActivityActorAvatar(queryBuilder)

    queryBuilder.where('activity.entity = :entity', { entity }).andWhere('activity.entityId = :entityId', { entityId })

    return queryBuilder
      .limit(100)
      .orderBy('activity.createdAt', 'DESC')
      .getMany()
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

  static getEntity(entity: string): string {
    switch (entity) {
      case 'taskboard':
        return ActivityType.TaskBoard

      case 'tasklist':
        return ActivityType.TaskList

      default:
        return ucFirst(entity)
    }
  }
}
