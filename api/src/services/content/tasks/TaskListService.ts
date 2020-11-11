import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskList } from '../../../database/entities/tasks/TaskList'
import { Task } from '../../../database/entities/tasks/Task'
import { Service, TaskService } from '../../'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { TaskListActivity } from '../../activity/activities/content'
import { clientError, HttpErrName, HttpStatusCode } from '../../../response/errors'

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

  async getById(id: number): Promise<TaskList | undefined> {
    return this.getTaskListRepository().findOne(id)
  }

  async requireById(id: number): Promise<TaskList> {
    const taskList = await this.getById(id)

    if (!taskList) {
      clientError('Task List not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return taskList
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
    const taskList = await this.requireById(taskListId)

    await this.taskService.listArchived(taskList.id)

    await this.getTaskListRepository().softRemove(taskList)
    await this.notifyActivity(TaskListActivity.archived(taskList))

    return taskList
  }

  async boardArchived(taskBoardId: number): Promise<void> {
    const lists = await this.getTaskListRepository().getByTaskBoardId(taskBoardId)

    for (const list of lists) {
      await this.getTaskListRepository().softRemove(list)
      await this.taskService.listArchived(list.id)
    }
  }

  async restore(taskListId: number): Promise<TaskList> {
    const taskList = await this.getArchivedById(taskListId)

    await this.taskService.listRestored(taskList.id)

    await this.getTaskListRepository().recover(taskList)
    await this.notifyActivity(TaskListActivity.restored(taskList))

    return taskList
  }

  async boardRestored(taskBoardId: number): Promise<void> {
    const lists = await this.getTaskListRepository().getByTaskBoardId(taskBoardId, { withDeleted: true })

    for (const list of lists) {
      await this.getTaskListRepository().recover(list)
      await this.taskService.listRestored(list.id)
    }
  }

  async remove(id: number) {
    const taskList = await this.getById(id)

    await this.notifyActivity(TaskListActivity.deleted(taskList))
    return this.getTaskListRepository().remove(taskList)
  }
}
