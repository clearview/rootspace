import { getCustomRepository } from 'typeorm'
import { TaskListRepository } from '../../../repositories/tasks/TaskListRepository'
import { TaskList } from '../../../entities/tasks/TaskList'
import { ContentManager } from '../ContentManager'
import { clientError } from '../../../errors'

export class TaskListService {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  private static instance: TaskListService

  static getInstance() {
    if (!TaskListService.instance) {
      TaskListService.instance = new TaskListService()
    }

    return TaskListService.instance
  }

  getTaskListRepository(): TaskListRepository {
    return getCustomRepository(TaskListRepository)
  }

  async getById(id: number): Promise<TaskList> {
    return this.getTaskListRepository().findOne(id)
  }

  async create(data: any): Promise<TaskList> {
    return this.getTaskListRepository().save(data.getAttributes())
  }

  async update(data: any, id: number): Promise<TaskList> {
    const taskList = await this.getById(id)

    if (!taskList) {
      throw clientError('Error updating task list')
    }

    Object.assign(taskList, data.getAttributes())
    return this.getTaskListRepository().save(taskList)
  }

  async delete(id: number) {
    const taskList = await this.getById(id)

    if (!taskList) {
      throw clientError('Error deleting task list')
    }

    return this.getTaskListRepository().delete({id})
  }
}
