import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskListService } from '../../services'
import { ForbiddenError } from '@casl/ability'
import { Actions, Subjects } from '../../middleware/AuthMiddleware'
import { ServiceFactory } from '../../services/factory/ServiceFactory'

export class TaskListCtrl extends BaseCtrl {
  private taskListService: TaskListService

  constructor() {
    super()
    this.taskListService = ServiceFactory.getInstance().getTaskListService()
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

  async archive(req: Request, res: Response, next: NextFunction) {
    const taskListId = Number(req.params.id)

    const taskList = await this.taskListService.getById(taskListId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, taskList ? taskList : Subjects.TaskList)

    const result = await this.taskListService.archive(taskListId)
    res.send(result)
  }

  async restore(req: Request, res: Response, next: NextFunction) {
    const taskListId = Number(req.params.id)

    const taskList = await this.taskListService.getArchivedById(taskListId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, taskList ? taskList : Subjects.TaskList)

    const result = await this.taskListService.restore(taskListId)
    res.send(result)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.taskListService.remove(Number(req.params.id))
    res.send(result)
  }
}
