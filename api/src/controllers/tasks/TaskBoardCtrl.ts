import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskBoardService } from '../../services'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { ContentManager } from '../../services/content/ContentManager'

export class TaskBoardCtrl extends BaseCtrl {
  private taskBoardService: TaskBoardService
  private contentManager: ContentManager

  constructor() {
    super()
    this.taskBoardService = TaskBoardService.getInstance()
    this.contentManager = ContentManager.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskBoardService.getById(Number(req.params.id))

    if (!task) {
      return next(
        clientError(
          'Task board not found',
            HttpErrName.EntityNotFound,
            HttpStatusCode.NotFound
        )
      )
    }

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    const taskBoard = await this.taskBoardService.create(data)
    const resData = this.responseData(taskBoard)

    const link = await this.taskBoardService.getLinkByContent(taskBoard)
    resData.includes(link, 'link')

    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = req.body.data
      const task = await this.taskBoardService.update(data, id)

      res.send(this.responseData(task))
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.taskBoardService.delete(Number(req.params.id))
      res.send(result)
    } catch (err) {
      next(err)
    }
  }
}
