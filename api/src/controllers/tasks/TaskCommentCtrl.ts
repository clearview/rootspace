import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskService } from '../../services'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { ContentManager } from '../../services/content/ContentManager'

export class TaskCommentCtrl extends BaseCtrl {
  private taskService: TaskService
  private contentManager: ContentManager

  constructor() {
    super()
    this.taskService = TaskService.getInstance()
    this.contentManager = ContentManager.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.getById(Number(req.params.id))

    if (!task) {
      return next(
        clientError(
          'Task comment not found',
            HttpErrName.EntityNotFound,
            HttpStatusCode.NotFound
        )
      )
    }

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      const task = await this.taskService.create(data)
      const resData = this.responseData(task)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = req.body.data
      const task = await this.taskService.update(data, id)

      res.send(this.responseData(task))
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.taskService.delete(Number(req.params.id))
      res.send(result)
    } catch (err) {
      next(err)
    }
  }
}
