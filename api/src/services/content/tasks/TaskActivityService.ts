import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../database/repositories/tasks/TaskRepository'
import { TaskActivityRepository } from '../../../database/repositories/tasks/TaskActivityRepository'
import { TaskActivity } from '../../../database/entities/tasks/TaskActivity'

export class TaskActivityService {
  private constructor() {}

  private static instance: TaskActivityService

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

  async update(id: number, data: any): Promise<TaskActivity> {
    let taskActivity = await this.getById(id)
    taskActivity = await this.getTaskActivityRepository().save({
      ...taskActivity,
      ...data,
    })

    return this.getTaskActivityRepository().reload(taskActivity)
  }

  async delete(id: number) {
    return this.getTaskActivityRepository().delete({ id })
  }
}
