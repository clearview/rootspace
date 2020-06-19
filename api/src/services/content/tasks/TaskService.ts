import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../repositories/tasks/TaskListRepository'
import { TaskRepository } from '../../../repositories/tasks/TaskRepository'
import { Task } from '../../../entities/tasks/Task'
import { ContentManager } from '../ContentManager'
import { UserService } from '../../UserService'
import { TaskBoardTagService } from './TaskBoardTagService'

export class TaskService {
  private userService: UserService
  private tagService: TaskBoardTagService
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
    this.userService = UserService.getInstance()
    this.tagService = TaskBoardTagService.getInstance()
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

  async create(data: any): Promise<Task> {
    data.list = await this.getTaskListRepository().findOneOrFail(data.listId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.list.boardId)
    data.space = await this.getSpaceRepository().findOneOrFail(data.board.spaceId)

    const task = await this.getTaskRepository().save(data)
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

    return this.getTaskRepository().reload(task)
  }

  async archive(id: number) {
    return this.getTaskRepository().softDelete({id})
  }

  async restore(id: number) {
    return this.getTaskRepository().restore({id})
  }

  async delete(id: number) {
    return this.getTaskRepository().delete({ id })
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

      await this.getTaskRepository().save(task)
    }

    return task
  }

  async assigneeRemove(taskId: number, userId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const user = await this.userService.getUserById(userId)

    task.assignees = task.assignees.filter(assignee => {
      return assignee.id !== user.id
    })

    return this.getTaskRepository().save(task)
  }

  async tagAdd(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getTagById(tagId)

    if (!task.tags.includes(boardTag)) {
      const tags = task.tags
      tags.push(boardTag)
      task.tags = tags

      await this.getTaskRepository().save(task)
    }

    return task
  }

  async tagRemove(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getTagById(tagId)

    task.tags = task.tags.filter(tag => {
      return tag.id !== boardTag.id
    })

    return this.getTaskRepository().save(task)
  }
}
