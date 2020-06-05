import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { TaskListRepository } from '../../../repositories/TaskListRepository'
import { TaskList } from '../../../entities/TaskList'
import { TaskListCreateValue, TaskListUpdateValue } from '../../../values/tasks/list'
import { Link } from '../../../entities/Link'
import { LinkType } from '../../../constants'
import { LinkCreateValue, LinkUpdateValue } from '../../../values/link'
import { ILinkContent } from '../../types'
import { ContentManager } from '../ContentManager'
import { clientError } from '../../../errors/client'

export class TaskListService implements ILinkContent<TaskList> {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  private static instance: TaskListService

  static getInstance() {
    if (!TaskListService.instance) {
      TaskListService.instance = new TaskListService()
    }

    return TaskListService.instance
  }

  getTaskListRepository(): TaskListRepository {
    return getCustomRepository(TaskListRepository)
  }

  getLinkByContent(taskList: TaskList): Promise<Link> {
    return this.contentManager.getLinkByValue(String(taskList.id))
  }

  createLinkByContent(taskList: TaskList): Promise<Link> {
    const linkCreateData = LinkCreateValue.fromObject({
      userId: taskList.userId,
      spaceId: taskList.spaceId,
      title: taskList.title,
      type: LinkType.Task,
      value: String(taskList.id),
    })

    return this.contentManager.createLinkByContent(linkCreateData)
  }

  async updateLinkByContent(taskList: TaskList): Promise<UpdateResult> {
    const link = await this.contentManager.getLinkByValue(String(taskList.id))

    const updateLinkData = LinkUpdateValue.fromObject({
      title: taskList.title,
    })

    return this.contentManager.updateLinkByContent(updateLinkData, link.id)
  }

  async deleteLinkByContent(taskList: TaskList): Promise<DeleteResult> {
    const link = await this.contentManager.getLinkByValue(String(taskList.id))
    return this.contentManager.deleteLinkByContent(link.id)
  }

  getContentByLink(link: Link): Promise<TaskList> {
    return this.getById(String(link.value))
  }

  updateContentByLink(link: Link): Promise<UpdateResult> {
    const data = TaskListUpdateValue.fromObject({
      title: link.title,
    })

    return this.getTaskListRepository().update(
      Number(link.value),
      data.getAttributes()
    )
  }

  deleteContentByLink(link: Link): Promise<DeleteResult> {
    return this.getTaskListRepository().delete(String(link.value))
  }

  async getById(id: string): Promise<TaskList> {
    return this.getTaskListRepository().findOne(id)
  }

  async create(data: TaskListCreateValue): Promise<TaskList> {
    const taskList = await this.getTaskListRepository().save(data.getAttributes())
    await this.createLinkByContent(taskList)

    return taskList
  }

  async update(data: TaskListUpdateValue, id: string): Promise<TaskList> {
    let taskList = await this.getById(id)

    if (!taskList) {
      throw clientError('Error updating task')
    }

    Object.assign(taskList, data.getAttributes())
    taskList = await this.getTaskListRepository().save(taskList)

    await this.updateLinkByContent(taskList)

    return taskList
  }

  async delete(id: string) {
    const taskList = await this.getById(id)

    if (!taskList) {
      throw clientError('Error deleting document')
    }

    const res = await this.getTaskListRepository().delete({
      id,
    })

    if (res.affected > 0) {
      await this.deleteLinkByContent(taskList)
    }

    return res
  }
}
