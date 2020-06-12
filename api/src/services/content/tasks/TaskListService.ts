import { getCustomRepository } from 'typeorm'
import { TaskListRepository } from '../../../repositories/tasks/TaskListRepository'
import { TaskList } from '../../../entities/tasks/TaskList'
import { ContentManager } from '../ContentManager'

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
    return this.getTaskListRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskList> {
    return this.getTaskListRepository().save(data)
  }

  async update(id: number, data: any): Promise<TaskList> {
    let taskList = await this.getById(id)
    taskList = await this.getTaskListRepository().save({
      ...taskList,
      ...data
    })

    return this.getTaskListRepository().reload(taskList)
  }

  async delete(id: number) {
    return this.getTaskListRepository().delete({id})
  }
}
