import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskListService } from '../../services'
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
    const taskList = await this.taskListService.getById(Number(req.params.id))

    const resData = this.responseData(taskList)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.userId = req.user.id

    const taskList = await this.taskListService.create(data)

    const resData = this.responseData(taskList)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body.data
    const task = await this.taskListService.update(id, data)

    res.send(this.responseData(task))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.taskListService.delete(Number(req.params.id))
    res.send(result)
  }
}
