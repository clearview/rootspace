import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskRepository } from '../../../database/repositories/tasks/TaskRepository'
import { Task } from '../../../database/entities/tasks/Task'
import { UserService } from '../../UserService'
import { TaskBoardTagService } from './TaskBoardTagService'
import { TaskActivities } from '../../../database/entities/activities/TaskActivities'
import { ActivityService } from '../../ActivityService'
import { ActivityEvent } from '../../events/ActivityEvent'
import Bull from 'bull'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { TaskList } from '../../../database/entities/tasks/TaskList'
import { NotificationService } from '../../NotificationService'
import { Notification } from '../../../database/entities/Notification'

export class TaskService {
  private userService: UserService
  private tagService: TaskBoardTagService
  private activityService: ActivityService
  private notificationService: NotificationService

  private constructor() {
    this.userService = UserService.getInstance()
    this.tagService = TaskBoardTagService.getInstance()
    this.activityService = ActivityService.getInstance()
    this.notificationService = NotificationService.getInstance()
    this.activityService = ServiceFactory.getInstance().getActivityService()
  }

  private static instance: TaskService

  static getInstance() {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService()
    }

    return TaskService.instance
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

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  async getById(id: number): Promise<Task> {
    return this.getTaskRepository().getById(id)
  }

  // Todo: remove when task table gets taskBoardID field
  async getTaskListByTask(task: Task): Promise<TaskList> {
    return this.getTaskListRepository().findOne(task.listId)
  }

  async getArchivedById(id: number): Promise<Task> {
    return this.getTaskRepository().findOneArchived(id)
  }

  async create(data: any): Promise<Task> {
    data.list = await this.getTaskListRepository().findOneOrFail(data.listId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.list.boardId)
    data.space = await this.getSpaceRepository().findOneOrFail(data.board.spaceId)

    const task = await this.getTaskRepository().save(data)

    await this.registerActivityForTaskId(TaskActivities.Created, task.id)
    await this.assigneesUpdate(task, data)

    return this.getTaskRepository().getById(task.id)
  }

  async update(id: number, data: any): Promise<Task> {
    let task = await this.getById(id)
    task = await this.getTaskRepository().save({
      ...task,
      ...data,
    })

    await this.assigneesUpdate(task, data)
    await this.registerActivityForTaskId(TaskActivities.Updated, task.id)

    return this.getTaskRepository().getById(task.id)
  }

  async archive(taskId: number): Promise<Task | undefined> {
    const task = await this.getTaskRepository().findOneArchived(taskId)

    if (task) {
      await this.registerActivityForTaskId(TaskActivities.Archived, taskId)
      return this.getTaskRepository().softRemove(task)
    }

    return null
  }

  async restore(taskId: number): Promise<Task> {
    const task = await this.getTaskRepository().findOneArchived(taskId)

    const recoveredTask = await this.getTaskRepository().recover(task)
    await this.registerActivityForTaskId(TaskActivities.Restored, taskId)

    return recoveredTask
  }

  async remove(taskId: number) {
    const task = await this.getTaskRepository().findOneOrFail(taskId)
    await this.registerActivityForTask(TaskActivities.Deleted, task)

    return this.getTaskRepository().remove(task)
  }

  async assigneesUpdate(task: Task, data: any): Promise<Task> {
    if (!data.assignees) {
      return task
    }

    const assignees = []

    for (const userId of data.assignees) {
      const user = await this.userService.getUserById(userId)
      assignees.push(user)
    }

    task.assignees = assignees

    return this.getTaskRepository().save(task)
  }

  async assigneeAdd(taskId: number, userId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const user = await this.userService.getUserById(userId)

    if (!task.assignees.includes(user)) {
      const assignees = task.assignees
      assignees.push(user)
      task.assignees = assignees

      const savedTask = await this.getTaskRepository().save(task)
      await this.registerActivityForTask(TaskActivities.Assignee_Added, task)

      return savedTask
    }

    return task
  }

  async assigneeRemove(taskId: number, userId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const user = await this.userService.getUserById(userId)

    task.assignees = task.assignees.filter((assignee) => {
      return assignee.id !== user.id
    })

    const savedTask = await this.getTaskRepository().save(task)
    await this.registerActivityForTask(TaskActivities.Assignee_Removed, task)

    return savedTask
  }

  async tagAdd(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getById(tagId)

    if (!task.tags.includes(boardTag)) {
      const tags = task.tags
      tags.push(boardTag)
      task.tags = tags

      const savedTask = await this.getTaskRepository().save(task)
      await this.registerActivityForTask(TaskActivities.Tag_Added, task)

      return savedTask
    }

    return task
  }

  async tagRemove(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getById(tagId)

    task.tags = task.tags.filter((tag) => {
      return tag.id !== boardTag.id
    })

    const savedTask = await this.getTaskRepository().save(task)
    await this.registerActivityForTask(TaskActivities.Tag_Removed, task)

    return savedTask
  }

  async registerActivityForTaskId(taskActivity: TaskActivities, taskId: number): Promise<Bull.Job> {
    const task = await this.getById(taskId)
    return this.registerActivityForTask(taskActivity, task)
  }

  async registerActivityForTask(taskActivity: TaskActivities, task: Task): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(taskActivity)
        .fromActor(actor.id)
        .forEntity(task)
        .inSpace(task.spaceId)
    )
  }
}
