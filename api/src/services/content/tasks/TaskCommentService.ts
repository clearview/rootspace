import { getCustomRepository } from 'typeorm'
import { TaskCommentRepository } from '../../../database/repositories/tasks/TaskCommentRepository'
import { TaskComment } from '../../../database/entities/tasks/TaskComment'
import { TaskActivities } from '../../../database/entities/activities/TaskActivities'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { TaskService } from './TaskService'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { Upload } from '../../../database/entities/Upload'

export class TaskCommentService {
  private static instance: TaskCommentService
  private taskService: TaskService

  private constructor() {
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
    await this.registerActivityForTaskCommentId(TaskActivities.Comment_Created, taskComment.id)
    return this.getTaskCommentRepository()
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: taskComment.id })
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne('user.avatar', Upload, 'avatar', 'avatar.entityId = user.id and avatar.entity = \'User\'')
      .getOne()
  }

  async update(id: number, data: any): Promise<TaskComment> {
    let taskComment = await this.getById(id)
    taskComment = await this.getTaskCommentRepository().save({
      ...taskComment,
      ...data,
    })

    await this.registerActivityForTaskComment(TaskActivities.Comment_Updated, taskComment)

    return this.getTaskCommentRepository()
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: taskComment.id })
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne('user.avatar', Upload, 'avatar', 'avatar.entityId = user.id and avatar.entity = \'User\'')
      .getOne()
  }

  async delete(taskCommentId: number): Promise<DeleteResult> {
    await this.registerActivityForTaskCommentId(TaskActivities.Comment_Deleted, taskCommentId)
    return this.getTaskCommentRepository().delete({ id: taskCommentId })
  }

  async registerActivityForTaskCommentId(taskActivity: TaskActivities, taskCommentId: number): Promise<any> {
    const taskComment = await this.getById(taskCommentId)
    return this.registerActivityForTaskComment(taskActivity, taskComment)
  }

  async registerActivityForTaskComment(taskActivity: TaskActivities, taskComment: TaskComment): Promise<any> {
    const task = await this.taskService.getById(taskComment.taskId)
    return this.taskService.registerActivityForTask(taskActivity, task)
  }
}
