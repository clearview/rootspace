import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskCommentService } from '../../services/content/tasks'

export class TaskCommentCtrl extends BaseCtrl {
  private taskCommentService: TaskCommentService

  constructor() {
    super()
    this.taskCommentService = TaskCommentService.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskCommentService.getById(Number(req.params.id))

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.user = req.user

    const taskComment = await this.taskCommentService.create(data)
    const resData = this.responseData(taskComment)

    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body.data

    const taskComment = await this.taskCommentService.update(id, data)

    res.send(this.responseData(taskComment))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const taskCommentId = Number(req.params.id)

    const result = await this.taskCommentService.delete(taskCommentId)
    res.send(result)
  }
}
