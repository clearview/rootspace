import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { TaskBoardRepository } from '../../../repositories/TaskBoardRepository'
import { TaskBoard } from '../../../entities/TaskBoard'
import { TaskCreateValue, TaskUpdateValue } from '../../../values/task'
import { Link } from '../../../entities/Link'
import { LinkType } from '../../../constants'
import { LinkCreateValue, LinkUpdateValue } from '../../../values/link'
import { ILinkContent } from '../../types'
import { ContentManager } from '../ContentManager'
import { clientError } from '../../../errors/client'

export class TaskBoardService implements ILinkContent<TaskBoard> {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  private static instance: TaskBoardService

  static getInstance() {
    if (!TaskBoardService.instance) {
      TaskBoardService.instance = new TaskBoardService()
    }

    return TaskBoardService.instance
  }

  getTaskBoardRepository(): TaskBoardRepository {
    return getCustomRepository(TaskBoardRepository)
  }

  getLinkByContent(taskBoard: TaskBoard): Promise<Link> {
    return this.contentManager.getLinkByValue(String(taskBoard.id))
  }

  createLinkByContent(taskBoard: TaskBoard): Promise<Link> {
    const linkCreateData = LinkCreateValue.fromObject({
      userId: taskBoard.userId,
      spaceId: taskBoard.spaceId,
      title: taskBoard.title,
      type: LinkType.Task,
      value: String(taskBoard.id),
    })

    return this.contentManager.createLinkByContent(linkCreateData)
  }

  async updateLinkByContent(taskBoard: TaskBoard): Promise<UpdateResult> {
    const link = await this.contentManager.getLinkByValue(String(taskBoard.id))

    const updateLinkData = LinkUpdateValue.fromObject({
      title: taskBoard.title,
    })

    return this.contentManager.updateLinkByContent(updateLinkData, link.id)
  }

  async deleteLinkByContent(taskBoard: TaskBoard): Promise<DeleteResult> {
    const link = await this.contentManager.getLinkByValue(String(taskBoard.id))
    return this.contentManager.deleteLinkByContent(link.id)
  }

  getContentByLink(link: Link): Promise<TaskBoard> {
    return this.getById(Number(link.value))
  }

  updateContentByLink(link: Link): Promise<UpdateResult> {
    const data = TaskUpdateValue.fromObject({
      title: link.title,
    })

    return this.getTaskBoardRepository().update(
      Number(link.value),
      data.getAttributes()
    )
  }

  deleteContentByLink(link: Link): Promise<DeleteResult> {
    return this.getTaskBoardRepository().delete(Number(link.value))
  }

  async getById(id: number): Promise<TaskBoard> {
    return this.getTaskBoardRepository().findOne(id)
  }

  async create(data: TaskCreateValue): Promise<TaskBoard> {
    const doc = await this.getTaskBoardRepository().save(data.getAttributes())
    await this.createLinkByContent(doc)

    return doc
  }

  async update(data: TaskUpdateValue, id: number): Promise<TaskBoard> {
    let task = await this.getById(id)

    if (!task) {
      throw clientError('Error updating task')
    }

    Object.assign(task, data.getAttributes())
    task = await this.getTaskBoardRepository().save(task)

    await this.updateLinkByContent(task)

    return task
  }

  async delete(id: number) {
    const taskBoard = await this.getById(id)

    if (!taskBoard) {
      throw clientError('Error deleting document')
    }

    const res = await this.getTaskBoardRepository().delete({
      id,
    })

    if (res.affected > 0) {
      await this.deleteLinkByContent(taskBoard)
    }

    return res
  }
}
