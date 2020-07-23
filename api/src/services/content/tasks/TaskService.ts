import { getCustomRepository, UpdateResult } from 'typeorm'
import httpRequestContext from 'http-request-context'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskRepository } from '../../../database/repositories/tasks/TaskRepository'
import { Task } from '../../../database/entities/tasks/Task'
import { UserService } from '../../UserService'
import { TaskBoardTagService } from './TaskBoardTagService'
import { FollowService } from '../../FollowService'
import { TaskActivityService } from './TaskActivityService'
import { TaskActivities, TaskActivity } from '../../../database/entities/tasks/TaskActivity'

export class TaskService {
  private userService: UserService
  private tagService: TaskBoardTagService
  private followService: FollowService
  private activityService: TaskActivityService

  private constructor() {
    this.userService = UserService.getInstance()
    this.tagService = TaskBoardTagService.getInstance()
    this.followService = FollowService.getInstance()
    this.activityService = TaskActivityService.getInstance()
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
    return this.getTaskRepository().findOneOrFail(id)
  }

  async getArchivedById(id: number): Promise<Task> {
    return this.getTaskRepository()
        .createQueryBuilder()
        .where('task.id = :id', { id })
        .andWhere('task.deletedAt IS NOT NULL')
        .getOne()
  }

  async create(data: any): Promise<Task> {
    data.list = await this.getTaskListRepository().findOneOrFail(data.listId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.list.boardId)
    data.space = await this.getSpaceRepository().findOneOrFail(data.board.spaceId)

    const task = await this.getTaskRepository().save(data)

    await this.noteActivityForTask(task, TaskActivities.Task_Created)
    await this.assigneesUpdate(task, data)

    return this.getTaskRepository().reload(task)
  }

  async update(id: number, data: any): Promise<Task> {
    let task = await this.getById(id)
    task = await this.getTaskRepository().save({
      ...task,
      ...data,
    })

    await this.assigneesUpdate(task, data)
    await this.noteActivityForTask(task, TaskActivities.Task_Updated)

    return this.getTaskRepository().reload(task)
  }

  async archive(taskId: number): Promise<UpdateResult> {
    const archivedTask = await this.getTaskRepository().softDelete({id: taskId})

    await this.noteActivityForId(taskId, TaskActivities.Task_Archived)

    return archivedTask
  }

  async restore(taskId: number): Promise<UpdateResult> {
    const restoredTask = this.getTaskRepository().restore({id: taskId})
    await this.noteActivityForId(taskId, TaskActivities.Task_Restored)

    return restoredTask
  }

  async remove(taskId: number) {
    const task = await this.getTaskRepository().findOneOrFail(taskId)

    await this.followService.removeAllFromEntity(task)
    await this.noteActivityForTask(task, TaskActivities.Task_Deleted)

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
      await this.noteActivityForTask(savedTask, TaskActivities.Assignee_Added)

      await this.followService.follow(user, task)
    }

    return task
  }

  async assigneeRemove(taskId: number, userId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const user = await this.userService.getUserById(userId)

    task.assignees = task.assignees.filter(assignee => {
      return assignee.id !== user.id
    })

    await this.followService.unfollow(user, task)

    const savedTask = await this.getTaskRepository().save(task)
    await this.noteActivityForTask(savedTask, TaskActivities.Assignee_Removed)

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

      await this.noteActivityForTask(savedTask, TaskActivities.Tag_Added)
      return savedTask
    }

    return task
  }

  async tagRemove(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getById(tagId)

    task.tags = task.tags.filter(tag => {
      return tag.id !== boardTag.id
    })

    const savedTask = await this.getTaskRepository().save(task)
    await this.noteActivityForTask(savedTask, TaskActivities.Tag_Removed)

    return savedTask
  }

  async noteActivityForId(taskId: number, taskActivity: TaskActivities): Promise<TaskActivity> {
    const task = await this.getById(taskId)
    return this.noteActivityForTask(task, taskActivity)
  }

  async noteActivityForTask(task: Task, taskActivity: TaskActivities): Promise<TaskActivity> {
    const actor = httpRequestContext.get('user')

    return this.activityService.create({
      userId: actor.id,
      taskId: task.id,
      content: taskActivity
    })
  }
}
