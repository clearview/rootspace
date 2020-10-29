import { BaseRepository } from './BaseRepository'
import { EntityRepository, DeleteResult } from 'typeorm'
import { Follow } from '../entities/Follow'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {
  getTaskListFollows(taskListId: number): Promise<Follow[]> {
    return this.createQueryBuilder('follow')
      .distinct()
      .leftJoin('tasks', 'task', 'follow.entityId = task.id')
      .leftJoin('task_lists', 'taskList', 'task.listId = taskList.id')
      .where('follow.entity = :entity AND follow.entityId = :taskListId', { entity: 'TaskList', taskListId })
      .orWhere('follow.entity = :entity AND taskList.id = :taskListId', { entity: 'Task', taskListId })
      .getMany()
  }

  deleteByEntityAndEntityId(entity: string, entityId: number): Promise<DeleteResult> {
    return this.createQueryBuilder('follow')
      .delete()
      .where('entity = :entity', { entity })
      .andWhere('entityId = :entityId', { entityId })
      .execute()
  }
}
