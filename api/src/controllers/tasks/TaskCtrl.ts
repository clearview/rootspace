import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskCreateValue, TaskUpdateValue } from '../../values/tasks/task'
import { TaskService } from '../../services'
import { clientError, ClientErrName, ClientStatusCode } from '../../errors/client'
import { ContentManager } from '../../services/content/ContentManager'

export class TaskCtrl extends BaseCtrl {
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
          'Task not found',
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

      const value = TaskCreateValue.fromObjectAndUserId(
        data,
        Number(req.user.id)
      )

      const task = await this.taskService.create(value)
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

      const value = TaskUpdateValue.fromObject(data)
      const task = await this.taskService.update(value, id)

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
