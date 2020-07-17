import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskList } from '../../../database/entities/tasks/TaskList'

export class TaskListService {
  private constructor() {}

  private static instance: TaskListService

  static getInstance() {
    if (!TaskListService.instance) {
      TaskListService.instance = new TaskListService()
    }

    return TaskListService.instance
  }

  getSpaceRepository(): SpaceRepository {
    return getCustomRepository(SpaceRepository)
  }

  getTaskBoardRepository(): TaskBoardRepository {
    return getCustomRepository(TaskBoardRepository)
  }

  getTaskListRepository(): TaskListRepository {
    return getCustomRepository(TaskListRepository)
  }

  async getById(id: number): Promise<TaskList> {
    return this.getTaskListRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskList> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.boardId)

    const taskList = await this.getTaskListRepository().save(data)

    return this.getTaskListRepository().reload(taskList)
  }

  async update(id: number, data: any): Promise<TaskList> {
    let taskList = await this.getById(id)
    taskList = await this.getTaskListRepository().save({
      ...taskList,
      ...data,
    })

    return this.getTaskListRepository().reload(taskList)
  }

  async delete(id: number) {
    return this.getTaskListRepository().delete({ id })
  }
}
