import { EntityRepository, getConnection } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Follow } from '../entities/Follow'
import { ActivityEvent } from '../../services/events/ActivityEvent'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {
  async getEntityFromActivity(activity: ActivityEvent): Promise<any> {
    return getConnection()
      .getRepository(activity.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: activity.entityId})
      .getOne()
  }

  async getFollowsForTasks(taskIds: number[]): Promise<Follow[]> {
    return this.createQueryBuilder('follow')
      .where('follow.entityId IN (:...entityIds)', {entityIds: taskIds})
      .andWhere('follow.tableName = :tableName', {tableName: 'tasks'})
      .getMany()
  }
}
