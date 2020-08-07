import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskList } from '../../../database/entities/tasks/TaskList'
import { Task } from '../../../database/entities/tasks/Task'
import Bull from 'bull'
import { ActivityEvent } from '../../events/ActivityEvent'
import { ActivityService } from '../../ActivityService'
import { TaskListActivities } from '../../../database/entities/activities/TaskListActivities'
import { UpdateResult } from 'typeorm/index'
import { TaskService } from './TaskService'
import { ServiceFactory } from '../../factory/ServiceFactory'

export class TaskListService {
  private activityService: ActivityService
  private taskService: TaskService

  private constructor() {
    this.activityService = ServiceFactory.getInstance().getActivityService()
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

  async getArchivedById(id: number): Promise<TaskList | undefined> {
    return this.getTaskListRepository().findOneArchived(id)
  }

  async getAllTasks(id: number): Promise<Task[]> {
    const taskList = await this.getCompleteTasklist(id)
    return taskList.tasks
  }

  async getCompleteTasklist(id: number, archived?: boolean): Promise<TaskList | undefined> {
    return this.getTaskListRepository().getCompleteTasklist(id)
  }

  async create(data: any): Promise<TaskList> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.boardId)

    const taskList = await this.getTaskListRepository().save(data)
    await this.registerActivityForTaskListId(TaskListActivities.Created, taskList.id)

    return this.getTaskListRepository().reload(taskList)
  }

  async update(id: number, data: any): Promise<TaskList> {
    let taskList = await this.getById(id)
    taskList = await this.getTaskListRepository().save({
      ...taskList,
      ...data,
    })

    taskList = await this.getTaskListRepository().reload(taskList)
    await this.registerActivityForTaskList(TaskListActivities.Updated, taskList)

    return taskList
  }

  async archive(taskListId: number): Promise<UpdateResult> {
    await this.registerActivityForTaskListId(TaskListActivities.Archived, taskListId)

    const taskList = await this.getCompleteTasklist(taskListId)
    for(const task of taskList.tasks) {
      await this.taskService.archive(task.id)
    }

    return this.getTaskListRepository().softDelete({id: taskListId})
  }

  async restore(taskListId: number): Promise<UpdateResult> {
    const restoredTaskList = await this.getTaskBoardRepository().restore({id: taskListId})
    await this.registerActivityForTaskListId(TaskListActivities.Restored, taskListId)

    return restoredTaskList
  }

  async remove(id: number) {
    const taskList = await this.getById(id)
    await this.registerActivityForTaskList(TaskListActivities.Deleted, taskList)

    return this.getTaskListRepository().remove(taskList)
  }

  async registerActivityForTaskListId(taskListActivity: TaskListActivities, taskListId: number): Promise<Bull.Job> {
    const taskList = await this.getById(taskListId)
    return this.registerActivityForTaskList(taskListActivity, taskList)
  }

  async registerActivityForTaskList(taskListActivity: TaskListActivities, taskList: TaskList): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent
        .withAction(taskListActivity)
        .fromActor(actor.id)
        .forEntity(taskList)
        .inSpace(taskList.spaceId)
    )
  }
}
