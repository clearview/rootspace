import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { TaskBoardRepository } from '../../../repositories/tasks/TaskBoardRepository'
import { TaskBoard } from '../../../entities/tasks/TaskBoard'
import { Link } from '../../../entities/Link'
import { LinkType } from '../../../constants'
import { LinkCreateValue, LinkUpdateValue } from '../../../values/link'
import { ILinkContent } from '../../types'
import { ContentManager } from '../ContentManager'
import {DeepPartial} from 'typeorm/common/DeepPartial'

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

  async getById(id: number): Promise<TaskBoard> {
    return this.getTaskBoardRepository().findOneOrFail(id)
  }

  async create(data: DeepPartial<TaskBoard>): Promise<TaskBoard> {
    return this.getTaskBoardRepository().create(data)
  }

  async save(data: any): Promise<TaskBoard> {
    const taskBoard = await this.getTaskBoardRepository().save(data)
    await this.createLinkByContent(taskBoard)

    return taskBoard
  }

  async update(id: number, data: any): Promise<TaskBoard> {
    let taskBoard = await this.getById(id)
    taskBoard = await this.getTaskBoardRepository().save({
      ...taskBoard,
      ...data
    })

    await this.updateLinkByContent(taskBoard)

    return this.getTaskBoardRepository().reload(taskBoard)
  }

  async delete(id: number) {
    const taskBoard = await this.getById(id)

    const res = await this.getTaskBoardRepository().delete({id})

    if (res.affected > 0) {
      await this.deleteLinkByContent(taskBoard)
    }

    return res
  }

  /**
   * ILinkContent methods
   */

  getLinkByContent(taskBoard: TaskBoard): Promise<Link> {
    return this.contentManager.getLinkByValue(String(taskBoard.id))
  }

  createLinkByContent(taskBoard: TaskBoard): Promise<Link> {
    const linkCreateData = LinkCreateValue.fromObject({
      userId: taskBoard.userId,
      spaceId: taskBoard.spaceId,
      title: taskBoard.title,
      type: LinkType.TaskBoard,
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
    return this.getTaskBoardRepository().update(
        Number(link.value),
        {
          title: link.title
        }
    )
  }

  deleteContentByLink(link: Link): Promise<DeleteResult> {
    return this.getTaskBoardRepository().delete(String(link.value))
  }
}
