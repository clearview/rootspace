import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskBoardTagService } from '../../services/content/tasks'
import { TaskBoardService } from '../../services/content/tasks'
import { ServiceFactory } from '../../services/factory/ServiceFactory'

export class TaskBoardTagCtrl extends BaseCtrl {
  private taskBoardService: TaskBoardService
  private tagService: TaskBoardTagService

  constructor() {
    super()
    this.taskBoardService = ServiceFactory.getInstance().getTaskBoardService()
    this.tagService = ServiceFactory.getInstance().getTaskBoardTagService()
  }

  async list(req: Request, res: Response, next: NextFunction) {
    const tags = await this.tagService.getByTaskBoardId(Number(req.params.taskBoardId))

    const resData = this.responseData(tags)
    res.send(resData)
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const tag = await this.tagService.getById(Number(req.params.tagId))

    const resData = this.responseData(tag)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.taskBoard = await this.taskBoardService.getById(data.taskBoardId)

    const resData = await this.tagService.create(data)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let tag = await this.tagService.getById(Number(req.params.tagId))

    const data = req.body.data
    tag = await this.tagService.update(tag.id, data)

    res.send(this.responseData(tag))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.tagService.delete(Number(req.params.tagId))
    res.send(result)
  }
}
