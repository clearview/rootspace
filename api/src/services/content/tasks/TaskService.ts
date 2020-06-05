import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { TaskRepository } from '../../../repositories/TaskRepository'
import { Task } from '../../../entities/Task'
import { TaskCreateValue, TaskUpdateValue } from '../../../values/tasks/task'
import { Link } from '../../../entities/Link'
import { LinkType } from '../../../constants'
import { LinkCreateValue, LinkUpdateValue } from '../../../values/link'
import { ILinkContent } from '../../types'
import { ContentManager } from '../ContentManager'
import { clientError } from '../../../errors/client'

export class TaskService implements ILinkContent<Task> {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
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

  getLinkByContent(task: Task): Promise<Link> {
    return this.contentManager.getLinkByValue(String(task.id))
  }

  createLinkByContent(task: Task): Promise<Link> {
    const linkCreateData = LinkCreateValue.fromObject({
      userId: task.userId,
      spaceId: task.spaceId,
      title: task.title,
      type: LinkType.Task,
      value: String(task.id),
    })

    return this.contentManager.createLinkByContent(linkCreateData)
  }

  async updateLinkByContent(task: Task): Promise<UpdateResult> {
    const link = await this.contentManager.getLinkByValue(String(task.id))

    const updateLinkData = LinkUpdateValue.fromObject({
      title: task.title,
    })

    return this.contentManager.updateLinkByContent(updateLinkData, link.id)
  }

  async deleteLinkByContent(task: Task): Promise<DeleteResult> {
    const link = await this.contentManager.getLinkByValue(String(task.id))
    return this.contentManager.deleteLinkByContent(link.id)
  }

  getContentByLink(link: Link): Promise<Task> {
    return this.getById(String(link.value))
  }

  updateContentByLink(link: Link): Promise<UpdateResult> {
    const data = TaskUpdateValue.fromObject({
      title: link.title,
    })

    return this.getTaskRepository().update(
      Number(link.value),
      data.getAttributes()
    )
  }

  deleteContentByLink(link: Link): Promise<DeleteResult> {
    return this.getTaskRepository().delete(String(link.value))
  }

  async getById(id: string): Promise<Task> {
    return this.getTaskRepository().findOne(id)
  }

  async create(data: TaskCreateValue): Promise<Task> {
    const task = await this.getTaskRepository().save(data.getAttributes())
    await this.createLinkByContent(task)

    return task
  }

  async update(data: TaskUpdateValue, id: string): Promise<Task> {
    let task = await this.getById(id)

    if (!task) {
      throw clientError('Error updating task')
    }

    Object.assign(task, data.getAttributes())
    task = await this.getTaskRepository().save(task)

    await this.updateLinkByContent(task)

    return task
  }

  async delete(id: string) {
    const task = await this.getById(id)

    if (!task) {
      throw clientError('Error deleting document')
    }

    const res = await this.getTaskRepository().delete({
      id,
    })

    if (res.affected > 0) {
      await this.deleteLinkByContent(task)
    }

    return res
  }
}
