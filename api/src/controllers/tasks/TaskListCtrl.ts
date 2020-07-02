import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskListService } from '../../services'

export class TaskListCtrl extends BaseCtrl {
  private taskListService: TaskListService

  constructor() {
    super()
    this.taskListService = TaskListService.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const taskList = await this.taskListService.getById(Number(req.params.id))

    const resData = this.responseData(taskList)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.user = req.user

    const taskList = await this.taskListService.create(data)

    const resData = this.responseData(taskList)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const taskList = await this.taskListService.update(Number(req.params.id), req.body.data)

    res.send(this.responseData(taskList))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.taskListService.delete(Number(req.params.id))
    res.send(result)
  }
}
