import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { Actions, Subjects } from '../../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { TaskBoardService } from '../../services'

export class TaskBoardCtrl extends BaseCtrl {
  private taskBoardService: TaskBoardService

  constructor() {
    super()
    this.taskBoardService = ServiceFactory.getInstance().getTaskBoardService()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const taskBoard = await this.taskBoardService.getCompleteTaskBoard(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, taskBoard ? taskBoard : Subjects.TaskBoard)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async viewByTaskId(req: Request, res: Response, next: NextFunction) {
    const taskBoard = await this.taskBoardService.getByTaskId(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, taskBoard ? taskBoard : Subjects.TaskBoard)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async searchTasks(req: Request, res: Response, next: NextFunction) {
    let taskBoard = await this.taskBoardService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, taskBoard)

    const data = req.body.data
    const searchParam = data?.search
    const filterParam = data?.filters

    taskBoard = await this.taskBoardService.searchTaskBoard(Number(req.params.id), searchParam, filterParam)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.user = req.user

    let taskBoard = await this.taskBoardService.create(data)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Create, taskBoard)

    taskBoard = await this.taskBoardService.save(taskBoard, data.parentId)
    const resData = this.responseData(taskBoard)

    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let taskBoard = await this.taskBoardService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Update, taskBoard)

    const data = req.body.data
    taskBoard = await this.taskBoardService.update(taskBoard.id, data, req.user.id)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async archive(req: Request, res: Response) {
    const taskBoardId = Number(req.params.id)

    const taskBoard = await this.taskBoardService.getById(taskBoardId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, taskBoard ? taskBoard : Subjects.TaskBoard)

    const result = await this.taskBoardService.archive(taskBoardId, req.user.id)
    res.send(result)
  }

  async restore(req: Request, res: Response) {
    const taskBoardId = Number(req.params.id)

    const taskBoard = await this.taskBoardService.getArchivedTaskBoardById(taskBoardId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, taskBoard ? taskBoard : Subjects.TaskBoard)

    const result = await this.taskBoardService.restore(taskBoardId, req.user.id)
    res.send(result)
  }

  async delete(req: Request, res: Response) {
    const taskBoard = await this.taskBoardService.requireById(Number(req.params.id), { withDeleted: true })
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, taskBoard)

    const result = await this.taskBoardService.remove(taskBoard.id, req.user.id)
    res.send(result)
  }

  async archived(req: Request, res: Response, next: NextFunction) {
    const taskBoardId = Number(req.params.id)
    const taskBoard = await this.taskBoardService.searchTaskBoard(Number(req.params.id), '', { archived: true })

    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, taskBoard)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }
}
