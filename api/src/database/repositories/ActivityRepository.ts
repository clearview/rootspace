import { EntityRepository } from 'typeorm'
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

  async getBySpaceId(spaceId: number, type?: string, action?: string): Promise<Activity[]> {
    const qb = this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.actor', 'user')
      .where('activity.spaceId = :spaceId', { spaceId })

    if (action) {
      qb.andWhere('activity.action = :action', { action })
    }

    if (type) {
      const entityType = ActivityRepository.getEntity(type)
      qb.andWhere('activity.entity = :entityType', { entityType })
    }

    const results = await qb
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

  async getByEntity(entity: string, entityId: number): Promise<Activity[]> {
    entity = ActivityRepository.getEntity(entity)

    const qb = this.createQueryBuilder('activity')
      .leftJoinAndMapOne('activity.actor', User, 'actor', 'actor.id = activity.actorId')
      .leftJoinAndMapOne(
        'actor.avatar',
        Upload,
        'upload',
        'upload.entityId = activity.actorId and upload.entity = :uploadEntity',
        { uploadEntity: 'User' }
      )
      .where('activity.entity = :entity', { entity })
      .andWhere('activity.entityId = :entityId', { entityId })

    return qb
      .limit(100)
      .orderBy('activity.createdAt', 'DESC')
      .getMany()
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
