import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../repositories/tasks/TaskRepository'
import { TaskCommentRepository } from '../../../repositories/tasks/TaskCommentRepository'
import { TaskComment } from '../../../entities/tasks/TaskComment'
import { ContentManager } from '../ContentManager'

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

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  getTaskCommentRepository(): TaskCommentRepository {
    return getCustomRepository(TaskCommentRepository)
  }

  async getById(id: number): Promise<TaskComment> {
    return this.getTaskCommentRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskComment> {
    data.task = await this.getTaskRepository().findOneOrFail(data.taskId)

    const taskComment = await this.getTaskCommentRepository().save(data)
    return this.getTaskCommentRepository().reload(taskComment)
  }

  async update(id: number, data: any): Promise<TaskComment> {
    let taskComment = await this.getById(id)
    taskComment = await this.getTaskCommentRepository().save({
      ...taskComment,
      ...data
    })

    return this.getTaskCommentRepository().reload(taskComment)
  }

  async delete(id: number) {
    return this.getTaskCommentRepository().delete({id})
  }
}
