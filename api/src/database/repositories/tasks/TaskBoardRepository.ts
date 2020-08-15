import { EntityRepository, getCustomRepository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { TaskBoard } from '../../entities/tasks/TaskBoard'
import { TaskRepository } from './TaskRepository'

@EntityRepository(TaskBoard)
export class TaskBoardRepository extends BaseRepository<TaskBoard> {
  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  getById(id: number, options: any = {}): Promise<TaskBoard | undefined> {
    const query = this.createQueryBuilder('taskBoard').where('taskBoard.id = :id', { id })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }

  getByTaskId(taskId: number): Promise<TaskBoard> {
    return this.createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .where('task.id = :taskId', { taskId })
      .andWhere('task.deletedAt IS NULL')
      .getOne()
  }

  getFullTaskBoard(id: number): Promise<TaskBoard | undefined> {
    const queryBuilder = this.createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('taskBoard.id = :id', { id })

    queryBuilder.orderBy('comment.createdAt', 'DESC')

    return queryBuilder.getOne()
  }

  getCompleteTaskBoard(id: number): Promise<TaskBoard | undefined> {
    const queryBuilder = this.createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('taskBoard.id = :id', { id })

    queryBuilder.andWhere('task.deletedAt IS NULL').orderBy('comment.createdAt', 'DESC')

    return queryBuilder.getOne()
  }

  async searchTaskBoard(id: number, searchParam?: string, filterParam?: any): Promise<TaskBoard> {
    const taskBoard = await this.createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .where('taskBoard.id = :id', { id })
      .getOne()

    const tasks = await this.getTaskRepository().filterByTaskBoardId(taskBoard.id, searchParam, filterParam)

    if (tasks.length === 0 || taskBoard.taskLists.length === 0) {
      return taskBoard
    }

    for (const list of taskBoard.taskLists) {
      if (!list.tasks) {
        list.tasks = []
      }

      for (const task of tasks) {
        if (task.listId === list.id) {
          list.tasks.push(task)
        }
      }
    }

    return taskBoard
  }

  async findOneArchived(id: number): Promise<TaskBoard> {
    return this.createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .where('taskBoard.id = :id', { id })
      .withDeleted()
      .getOne()
  }
}
