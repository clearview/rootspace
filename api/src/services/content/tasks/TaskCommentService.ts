import { getCustomRepository } from 'typeorm'
import { TaskCommentRepository } from '../../../repositories/tasks/TaskCommentRepository'
import { TaskComment } from '../../../entities/tasks/TaskComment'
import { ContentManager } from '../ContentManager'
import { clientError } from '../../../errors'

export class TaskCommentService {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  private static instance: TaskCommentService

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
    return this.getTaskCommentRepository().findOne(id)
  }

  async create(data: any): Promise<TaskComment> {
    return this.getTaskCommentRepository().save(data.getAttributes())
  }

  async update(data: any, id: number): Promise<TaskComment> {
    const taskComment = await this.getById(id)

    if (!taskComment) {
      throw clientError('Error updating comment')
    }

    Object.assign(taskComment, data.getAttributes())
    return this.getTaskCommentRepository().save(taskComment)
  }

  async delete(id: number) {
    const taskComment = await this.getById(id)

    if (!taskComment) {
      throw clientError('Error deleting comment')
    }

    return this.getTaskCommentRepository().delete({id})
  }
}
