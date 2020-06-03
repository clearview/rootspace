import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { validateTaskCreate, validateTaskUpdate } from '../../validation/task'
import { TaskCreateValue, TaskUpdateValue } from '../../values/tasks/task'
import { TaskListService } from '../../services'
import { clientError, ClientErrName, ClientStatusCode } from '../../errors/client'
import { ContentManager } from '../../services/content/ContentManager'

export class TaskListCtrl extends BaseCtrl {
  private taskListService: TaskListService
  private contentManager: ContentManager

  constructor() {
    super()
    this.taskListService = TaskListService.getInstance()
    this.contentManager = ContentManager.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskListService.getById(Number(req.params.id))

    if (!task) {
      return next(
        clientError(
          'Task list not found',
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
      await validateTaskCreate(data)

      const value = TaskCreateValue.fromObjectAndUserId(
        data,
        Number(req.user.id)
      )

      const task = await this.taskListService.create(value)
      const resData = this.responseData(task)

      const link = await this.taskListService.getLinkByContent(task)
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

      await validateTaskUpdate(data)

      const value = TaskUpdateValue.fromObject(data)
      const task = await this.taskListService.update(value, id)

      res.send(this.responseData(task))
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.taskListService.delete(Number(req.params.id))
      res.send(result)
    } catch (err) {
      next(err)
    }
  }
}
