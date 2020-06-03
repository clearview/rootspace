import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { validateTaskBoardCreate, validateTaskBoardUpdate } from '../../validation/tasks/board'
import { TaskBoardCreateValue, TaskBoardUpdateValue } from '../../values/tasks/board'
import { TaskBoardService } from '../../services'
import { clientError, ClientErrName, ClientStatusCode } from '../../errors/client'
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
          ClientErrName.EntityNotFound,
          ClientStatusCode.NotFound
        )
      )
    }

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateTaskBoardCreate(data)

      const value = TaskBoardCreateValue.fromObjectAndUserId(
        data,
        Number(req.user.id)
      )

      const task = await this.taskBoardService.create(value)
      const resData = this.responseData(task)

      const link = await this.taskBoardService.getLinkByContent(task)
      resData.includes(link, 'link')

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = req.body.data

      await validateTaskBoardUpdate(data)

      const value = TaskBoardUpdateValue.fromObject(data)
      const task = await this.taskBoardService.update(value, id)

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
