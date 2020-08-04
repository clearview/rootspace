import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Activity } from '../entities/Activity'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { getConnection } from 'typeorm/index'

@EntityRepository(Activity)
export class ActivityRepository extends BaseRepository<Activity> {
  async getEntityFromActivityEvent(event: ActivityEvent): Promise<any> {
    return getConnection()
      .getRepository(event.activity.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: event.activity.id})
      .getOne()
  }
}
