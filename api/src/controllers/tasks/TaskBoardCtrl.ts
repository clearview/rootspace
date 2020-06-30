import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskBoardService } from '../../services'
import { ContentManager } from '../../services/content/ContentManager'
import { Actions } from '../../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'

export class TaskBoardCtrl extends BaseCtrl {
  private taskBoardService: TaskBoardService
  private contentManager: ContentManager

  constructor() {
    super()
    this.taskBoardService = TaskBoardService.getInstance()
    this.contentManager = ContentManager.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const taskBoard = await this.taskBoardService.getById(Number(req.params.id))

    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, taskBoard)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.userId = req.user.id

    let taskBoard = await this.taskBoardService.create(data)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Create, taskBoard)

    taskBoard = await this.taskBoardService.save(taskBoard)
    const resData = this.responseData(taskBoard)

    const link = await this.taskBoardService.getLinkByContent(taskBoard)
    resData.includes(link, 'link')

    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let taskBoard = await this.taskBoardService.getById(Number(req.params.id))

    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Update, taskBoard)

    const data = req.body.data
    taskBoard = await this.taskBoardService.update(taskBoard.id, data)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const taskBoard = await this.taskBoardService.getById(Number(req.params.id))

    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, taskBoard)

    const result = await this.taskBoardService.delete(taskBoard.id)
    res.send(result)
  }
}
