import { EntityRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Activity } from '../entities/Activity'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { ActivityType } from '../../types/activity'

@EntityRepository(Activity)
export class ActivityRepository extends BaseRepository<Activity> {
  async getEntityFromActivityEvent(event: ActivityEvent): Promise<any> {
    return getConnection()
      .getRepository(event.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: event.entityId})
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
      qb
        .leftJoinAndMapOne(`activity.${entityType}`, entityType, entityType, `activity.entityId = ${entityType}.id AND activity.entity = '${entityType}'`)
        .andWhere('activity.entity = :entityType', { entityType })
    } else {
      const entityList = Object.values(ActivityType)
      entityList.forEach((entity) => {
        qb.leftJoinAndMapOne(`activity.${entity}`, entity, entity, `activity.entityId = ${entity}.id AND activity.entity = '${entity}'`)
      })
    }

    const results = await qb
      .limit(100)
      .orderBy('activity.createdAt', 'DESC')
      .getMany()

    results.forEach((result) => {
      Object.keys(result).forEach(index => (!result[index] && result[index] !== undefined) && delete result[index])
    })

    return results
  }

  async getByTypeAndEntityIdId(spaceId: number, type: string, entityId: number, action?: string): Promise<Activity[]> {
    const entity = ActivityRepository.getEntity(type)

    const qb = this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.actor', 'user')
      .leftJoinAndMapOne(`activity.${entity}`, entity, entity, `activity.entityId = ${entity}.id`)
      .where('activity.entity = :entity', { entity })
      .andWhere('activity.spaceId = :spaceId', { spaceId })
      .andWhere('activity.entityId = :entityId', { entityId })

    if (action) {
      qb.andWhere('activity.action = :action', { action })
    }

    return qb.limit(100)
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
        return entity.ucFirst()
    }
  }
}
