import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Activity } from '../entities/Activity'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { getConnection } from 'typeorm/index'
import { ActivityType } from '../../types/activity'

@EntityRepository(Activity)
export class ActivityRepository extends BaseRepository<Activity> {
  async getEntityFromActivityEvent(event: ActivityEvent): Promise<any> {
    return getConnection()
      .getRepository(event.activity.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: event.activity.id})
      .getOne()
  }

  async getBySpaceId(spaceId: number, type?: string): Promise<Activity[]> {
    const qb = this.createQueryBuilder('activity')
      .where('activity.spaceId = :spaceId', { spaceId })

    if (type) {
      const entity = ActivityRepository.getEntity(type)
      qb.andWhere('activity.entity = :entity', { entity })
    }

    return qb
      .orderBy('activity.createdAt', 'DESC')
      .getMany()
  }

  async getByTypeAndEntityIdId(type: string, entityId: number): Promise<Activity[]> {
    const entity = ActivityRepository.getEntity(type)

    return this.createQueryBuilder('activity')
      .where('activity.entity = :entity', { entity })
      .andWhere('activity.entityId = :entityId', { entityId })
      .orderBy('activity.createdAt', 'DESC')
      .getMany()
  }

  static getEntity(entity: string): string {
    switch(entity) {
      case 'taskboard':
        return ActivityType.TaskBoard

      case 'tasklist':
        return ActivityType.TaskList

      default:
        return entity.charAt(0).toUpperCase() + entity.slice(1)
    }
  }
}
