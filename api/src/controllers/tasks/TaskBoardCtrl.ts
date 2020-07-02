import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { Actions } from '../../middleware/AuthMiddleware'
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
    const archived = req.params.archived && req.params.archived === 'archived'
    const taskBoard = await this.taskBoardService.getCompleteTaskboard(Number(req.params.id), archived)

    ForbiddenError.from(req.user.ability).throwUnlessCan(
      Actions.Read,
      taskBoard
    )

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.user = req.user

    let taskBoard = await this.taskBoardService.create(data)
    ForbiddenError.from(req.user.ability).throwUnlessCan(
      Actions.Create,
      taskBoard
    )

    taskBoard = await this.taskBoardService.save(taskBoard)
    const resData = this.responseData(taskBoard)

    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let taskBoard = await this.taskBoardService.getById(Number(req.params.id))

    ForbiddenError.from(req.user.ability).throwUnlessCan(
      Actions.Update,
      taskBoard
    )

    const data = req.body.data
    taskBoard = await this.taskBoardService.update(taskBoard.id, data)

    const resData = this.responseData(taskBoard)
    res.send(resData)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const taskBoard = await this.taskBoardService.getById(Number(req.params.id))

    ForbiddenError.from(req.user.ability).throwUnlessCan(
      Actions.Delete,
      taskBoard
    )

    const result = await this.taskBoardService.delete(taskBoard.id)
    res.send(result)
  }
}
