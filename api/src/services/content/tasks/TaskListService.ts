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
    await this.registerActivityForTaskListId(TaskListActivities.Created, taskList.id, {
      title: taskList.title
    })

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

    const fields = {}

    for(const key of Object.keys(data)){
      if(data[key] !== existingTaskList[key]){
        fields[key] = taskList[key]
      }
    }

    await this.registerActivityForTaskList(TaskListActivities.Updated, taskList, fields)

    return taskList
  }

  async archive(taskListId: number): Promise<TaskList | undefined> {
    const taskList = await this.getFullTaskList(taskListId)

    if (taskList && taskList.tasks) {
      for (const task of taskList.tasks) {
        await this.taskService.archive(task.id)
      }

      await this.registerActivityForTaskListId(TaskListActivities.Archived, taskListId, {
        title: taskList.title
      })

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

    await this.registerActivityForTaskListId(TaskListActivities.Restored, taskListId, {
      title: taskList.title
    })

    return recoveredTaskList
  }

  async remove(id: number) {
    const taskList = await this.getById(id)
    await this.registerActivityForTaskList(TaskListActivities.Deleted, taskList, {
      title: taskList.title
    })

    return this.getTaskListRepository().remove(taskList)
  }

  async registerActivityForTaskListId(taskListActivity: TaskListActivities, taskListId: number, context?: any): Promise<Bull.Job> {
    const taskList = await this.getById(taskListId)
    return this.registerActivityForTaskList(taskListActivity, taskList, context)
  }

  async registerActivityForTaskList(taskListActivity: TaskListActivities, taskList: TaskList, context?: any): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent
        .withAction(taskListActivity)
        .fromActor(actor.id)
        .forEntity(taskList)
        .inSpace(taskList.spaceId)
        .withContext(context)
    )
  }
}
