import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../repositories/tasks/TaskRepository'
import { Task } from '../../../entities/tasks/Task'
import { ContentManager } from '../ContentManager'
import { clientError } from '../../../errors'

export class TaskService {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  private static instance: TaskService

  static getInstance() {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService()
    }

    return TaskService.instance
  }

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  async getById(id: number): Promise<Task> {
    return this.getTaskRepository().findOne(id)
  }

  async create(data: any): Promise<Task> {
    return this.getTaskRepository().save(data.getAttributes())
  }

  async update(data: any, id: number): Promise<Task> {
    const task = await this.getById(id)

    if (!task) {
      throw clientError('Error updating task')
    }

    Object.assign(task, data.getAttributes())
    return this.getTaskRepository().save(task)
  }

  async delete(id: number) {
    const task = await this.getById(id)

    if (!task) {
      throw clientError('Error deleting task')
    }

    return this.getTaskRepository().delete({id})
  }
}
