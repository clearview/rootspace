import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Follow } from '../entities/Follow'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {
  async getFollowsForTasks(taskIds: number[]): Promise<Follow[]> {
    return this.createQueryBuilder('follow')
      .where('follow.itemId IN (:...itemIds)', {itemIds: taskIds})
      .andWhere('follow.tableName = :tableName', {tableName: 'tasks'})
      .getMany()
  }
}
