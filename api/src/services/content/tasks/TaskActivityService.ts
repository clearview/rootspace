import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../database/repositories/tasks/TaskRepository'
import { TaskActivityRepository } from '../../../database/repositories/tasks/TaskActivityRepository'
import { TaskActivity } from '../../../database/entities/tasks/TaskActivity'

export class TaskActivityService {

  private static instance: TaskActivityService

  private constructor() {}

  static getInstance() {
    if (!TaskActivityService.instance) {
      TaskActivityService.instance = new TaskActivityService()
    }

    return TaskActivityService.instance
  }

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  getTaskActivityRepository(): TaskActivityRepository {
    return getCustomRepository(TaskActivityRepository)
  }

  async getById(id: number): Promise<TaskActivity> {
    return this.getTaskActivityRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskActivity> {
    data.task = await this.getTaskRepository().findOneOrFail(data.taskId)

    const taskActivity = await this.getTaskActivityRepository().save(data)
    return this.getTaskActivityRepository().reload(taskActivity)
  }
}
