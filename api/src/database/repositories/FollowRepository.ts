import { BaseRepository } from './BaseRepository'
import { EntityRepository, DeleteResult, Brackets } from 'typeorm'
import { Follow } from '../entities/Follow'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {
  getTaskListFollows(taskListId: number): Promise<Follow[]> {
    return this.createQueryBuilder('follow')
      .distinctOn(['follow.userId'])
      .leftJoin('tasks', 'task', 'follow.entityId = task.id')
      .leftJoin('task_lists', 'taskList', 'task.listId = taskList.id')
      .where('follow.entity = :entity', { entity: 'Task' })
      .andWhere(' taskList.id = :taskListId', { taskListId })
      .getMany()
  }

  getTaskBoardFollows(taskBoardId: number): Promise<Follow[]> {
    return this.createQueryBuilder('follow')
      .distinctOn(['follow.userId'])
      .leftJoin('tasks', 'task', 'follow.entityId = task.id')
      .leftJoin('task_lists', 'taskList', 'taskList.id = task.listId')
      .leftJoin('task_boards', 'taskBoard', 'taskBoard.id = taskList.boardId')
      .where('follow.entity = :entity', { entity: 'Task' })
      .andWhere('taskBoard.id = :taskBoardId', { taskBoardId })
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
