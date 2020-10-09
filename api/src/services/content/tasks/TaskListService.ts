import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskList } from '../../../database/entities/tasks/TaskList'
import { Task } from '../../../database/entities/tasks/Task'
import { Service, ActivityService, TaskService } from '../../'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { TaskListActivity } from '../../activity/activities/content'

export class TaskListService extends Service {
  private taskService: TaskService

  private constructor() {
    super()
    this.taskService = ServiceFactory.getInstance().getTaskService()
  }

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

  async getArchivedById(id: number): Promise<TaskList> {
    return this.getTaskListRepository().findOneArchived(id)
  }

  async getAllTasks(id: number): Promise<Task[]> {
    const taskList = await this.getCompleteTaskList(id)
    return taskList.tasks
  }

  async getCompleteTaskList(id: number): Promise<TaskList> {
    return this.getTaskListRepository().getCompleteTaskList(id)
  }

  async getFullTaskList(id: number): Promise<TaskList> {
    return this.getTaskListRepository().getFullTaskList(id)
  }

  async create(data: any): Promise<TaskList> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.boardId)

    const taskList = await this.getTaskListRepository().save(data)
    await this.notifyActivity(TaskListActivity.created(taskList))

    return this.getTaskListRepository().reload(taskList)
  }

  async update(id: number, data: any): Promise<TaskList> {
    const existingTaskList = await this.getById(id)
    let taskList = await this.getById(id)

    taskList = await this.getTaskListRepository().save({
      ...taskList,
      ...data,
    })

    taskList = await this.getTaskListRepository().reload(taskList)

    await this.notifyActivity(TaskListActivity.updated(existingTaskList, taskList))

    return taskList
  }

  async archive(taskListId: number): Promise<TaskList | undefined> {
    const taskList = await this.getFullTaskList(taskListId)

    if (taskList && taskList.tasks) {
      for (const task of taskList.tasks) {
        if (task.deletedAt) {
          continue
        }

        await this.taskService.archive(task.id)
      }

      await this.notifyActivity(TaskListActivity.archived(taskList))

      return this.getTaskListRepository().softRemove(taskList)
    }

    return null
  }

  async restore(taskListId: number): Promise<TaskList> {
    const taskList = await this.getArchivedById(taskListId)

    if (taskList && taskList.tasks) {
      for (const task of taskList.tasks) {
        await this.taskService.restore(task.id)
      }
    }

    const recoveredTaskList = await this.getTaskListRepository().recover(taskList)
    await this.notifyActivity(TaskListActivity.restored(taskList))

    return recoveredTaskList
  }

  async remove(id: number) {
    const taskList = await this.getById(id)

    await this.notifyActivity(TaskListActivity.deleted(taskList))

    return this.getTaskListRepository().remove(taskList)
  }
}
