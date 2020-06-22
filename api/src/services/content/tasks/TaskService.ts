import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../repositories/tasks/TaskRepository'
import { Task } from '../../../entities/tasks/Task'
import { ContentManager } from '../ContentManager'
import {UserService} from '../../UserService'

export class TaskService {
  private userService: UserService
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
    this.userService = UserService.getInstance()
  }

  private static instance: TaskService

  static getInstance() {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService()
    }

    return TaskService.instance
  }

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  async getById(id: number): Promise<Task> {
    return this.getTaskRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<Task> {
    const task: Task = await this.getTaskRepository().save(data)

    await this.assigneesUpdate(task, data)

    return this.getTaskRepository().save(task)
  }

  async update(id: number, data: any): Promise<Task> {
    let task = await this.getById(id)
    task = await this.getTaskRepository().save({
      ...task,
      ...data
    })

    await this.assigneesUpdate(task, data)

    return this.getTaskRepository().reload(task)
  }

  async delete(id: number) {
    return this.getTaskRepository().delete({id})
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

  async assigneeAdd(task: Task, userId: number): Promise<Task> {
    const user = await this.userService.getUserById(userId)

    if (!task.assignees.includes(user)) {
      const assignees = task.assignees
      assignees.push(user)
      task.assignees = assignees
    }

    return task
  }

  async assigneeRemove(task: Task, userId: number): Promise<Task> {
    const user = await this.userService.getUserById(userId)

    task.assignees = task.assignees.filter(assignee => {
      return assignee.id !== user.id
    })

    return this.getTaskRepository().save(task)
  }

}
