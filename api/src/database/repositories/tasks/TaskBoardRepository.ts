import { EntityRepository, getCustomRepository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { TaskBoard } from '../../entities/tasks/TaskBoard'
import { TaskRepository } from './TaskRepository'
import { Upload } from '../../entities/Upload'

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
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('taskBoard.id = :id', { id })

    queryBuilder.orderBy('comment.createdAt', 'DESC')

    return queryBuilder.getOne()
  }

  async getCompleteTaskBoard(id: number): Promise<TaskBoard | undefined> {
    const queryBuilder = this.createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .leftJoinAndSelect('task.user', 'createdBy')
      .leftJoinAndMapOne(
        'createdBy.avatar',
        Upload,
        'avatar',
        'avatar.entityId = createdBy.id AND avatar.entity = :avatarEntity',
        { avatarEntity: Upload.entities.User }
      )
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndMapOne(
        'assignee.avatar',
        Upload,
        'assigneeAvatar',
        'assigneeAvatar.entityId = assignee.id and assigneeAvatar.entity = :assigneeAvatarEntity',
        { assigneeAvatarEntity: Upload.entities.User }
      )
      .leftJoinAndMapMany(
        'task.attachments',
        Upload,
        'upload',
        'upload.entityId = task.id AND upload.entity = :entity',
        {
          entity: 'Task',
        }
      )
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('taskBoard.id = :id', { id })

    queryBuilder.andWhere('task.deletedAt IS NULL').orderBy('comment.createdAt', 'DESC')

    return queryBuilder.getOne()
  }

  async searchTaskBoard(id: number, searchParam?: string, filterParam?: any): Promise<TaskBoard> {
    let taskBoard = null

    if (!filterParam.archived) {
      taskBoard = await this.createQueryBuilder('taskBoard')
        .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
        .where('taskBoard.id = :id', { id })
        .getOne()
    }

    if (filterParam.archived) {
      taskBoard = await this.createQueryBuilder('taskBoard')
        .withDeleted()
        .leftJoinAndSelect('taskBoard.taskLists', 'taskList','taskList.deletedAt IS NOT NULL OR taskList.deletedAt IS NULL')
        .leftJoinAndSelect('taskList.tasks', 'tasks', 'tasks.deletedAt IS NOT NULL')
        .where('taskBoard.id = :id', { id })
        .andWhere('taskBoard.deletedAt IS NULL')
        .getOne()
    }

    const tasks = await this.getTaskRepository().filterByTaskBoardId(taskBoard.id, searchParam, filterParam)

    if (tasks.length === 0 || taskBoard.taskLists.length === 0) {
      return taskBoard
    }

    // making a task object for easier search
    const taskListsThatAreNotDeleted = {}
    if (filterParam.archived) {
      for (const taskList of taskBoard.taskLists) {
        if (!taskList.deletedAt) {
          taskListsThatAreNotDeleted[+taskList.id] = true
        }
      }
    }

    for (const list of taskBoard.taskLists) {
      if (!list.tasks) {
        list.tasks = []
      }

      for (const task of tasks) {
        if (task.listId === list.id && !taskListsThatAreNotDeleted[task.listId]) {
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
