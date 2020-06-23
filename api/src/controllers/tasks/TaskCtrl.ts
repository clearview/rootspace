import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import {TaskService} from '../../services'
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

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.userId = req.user.id

    const task = await this.taskService.create(data)

    const resData = this.responseData(task)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body.data
    const task = await this.taskService.update(id, data)

    res.send(this.responseData(task))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.taskService.delete(Number(req.params.id))
    res.send(result)
  }

  async assigneeAdd(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.userId)

    let task = await this.taskService.getById(Number(req.params.id))
    task = await this.taskService.assigneeAdd(task, userId)

    res.send(this.responseData(task))
  }

  async assigneeRemove(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.userId)

    let task = await this.taskService.getById(Number(req.params.id))
    task = await this.taskService.assigneeRemove(task, userId)

    res.send(this.responseData(task))
  }
}
