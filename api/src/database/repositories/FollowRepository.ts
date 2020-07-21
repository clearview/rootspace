import { EntityRepository, getConnection } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Follow } from '../entities/Follow'
import { IEventProvider } from '../../services/events/EventType'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {
  async getOneFromEvent(event: IEventProvider): Promise<any> {
    return getConnection()
      .getRepository(event.targetName)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: event.itemId})
      .getOne()
  }

  async getFollowsForTasks(taskIds: number[]): Promise<Follow[]> {
    return this.createQueryBuilder('follow')
      .where('follow.itemId IN (:...itemIds)', {itemIds: taskIds})
      .andWhere('follow.tableName = :tableName', {tableName: 'tasks'})
      .getMany()
  }
}
