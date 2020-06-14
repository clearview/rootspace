import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../repositories/tasks/TaskRepository'
import { Task } from '../../../entities/tasks/Task'
import { ContentManager } from '../ContentManager'

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
    return this.getTaskRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<Task> {
    return this.getTaskRepository().save(data.getAttributes())
  }

  async update(id: number, data: any): Promise<Task> {
    let task = await this.getById(id)
    task = await this.getTaskRepository().save({
      ...task,
      ...data
    })

    return this.getTaskRepository().reload(task)
  }

  async delete(id: number) {
    return this.getTaskRepository().delete({id})
  }
}
