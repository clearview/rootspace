import { getCustomRepository, DeleteResult } from 'typeorm'
import { TaskCommentRepository } from '../../../database/repositories/tasks/TaskCommentRepository'
import { TaskComment } from '../../../database/entities/tasks/TaskComment'
import { Upload } from '../../../database/entities/Upload'
import { TaskService } from './TaskService'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { Service } from '../../Service'
import { TaskActivity } from '../../activity/activities/content'

export class TaskCommentService extends Service {
  private static instance: TaskCommentService
  private taskService: TaskService

  private constructor() {
    super()
    this.taskService = ServiceFactory.getInstance().getTaskService()
  }

  static getInstance() {
    if (!TaskCommentService.instance) {
      TaskCommentService.instance = new TaskCommentService()
    }

    return TaskCommentService.instance
  }

  getTaskCommentRepository(): TaskCommentRepository {
    return getCustomRepository(TaskCommentRepository)
  }

  async getById(id: number): Promise<TaskComment> {
    return this.getTaskCommentRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskComment> {
    data.task = await this.taskService.getById(data.taskId)

    const taskComment = await this.getTaskCommentRepository().save(data)

    await this.notifyActivity(TaskActivity.CommentCreated(data.task, taskComment, taskComment.userId))

    return this.getTaskCommentRepository()
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: taskComment.id })
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne('user.avatar', Upload, 'avatar', `avatar.entityId = user.id and avatar.entity = 'User'`)
      .getOne()
  }

  async update(id: number, data: any): Promise<TaskComment> {
    let taskComment = await this.getById(id)

    taskComment = await this.getTaskCommentRepository().save({
      ...taskComment,
      ...data,
    })

    return this.getTaskCommentRepository()
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: taskComment.id })
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne('user.avatar', Upload, 'avatar', `avatar.entityId = user.id and avatar.entity = 'User'`)
      .getOne()
  }

  async delete(taskCommentId: number): Promise<DeleteResult> {
    return this.getTaskCommentRepository().delete({ id: taskCommentId })
  }
}
