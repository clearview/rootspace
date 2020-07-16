import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { FollowService, TaskService } from '../../services'
import { Actions, Subjects } from '../../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'
import { WsService } from '../../services/content/WsService'
import { ServiceFactory } from '../../services/factory/ServiceFactory'

export class TaskCtrl extends BaseCtrl {
  private taskService: TaskService
  private followService: FollowService

  constructor() {
    super()
    this.taskService = ServiceFactory.getInstance().getTaskService()
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.getById(Number(req.params.id))

    // Todo: trigger this endpoint from the frontend in order to mark task related notifications read
    // await this.taskService.readNotificationsForTask(task)

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.user = req.user

    const task = await this.taskService.create(data)

    await WsService.fromRequest(req).onCreated(task)

    const resData = this.responseData(task)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)

    const task = await this.taskService.update(taskId, req.body.data)

    res.send(this.responseData(task))
  }

  async follow(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, task ? task : Subjects.Task)

    const result = await this.followService.followFromRequest(Number(req.user.id), task)
    res.send(result)
  }

  async unfollow(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, task ? task : Subjects.Task)

    const result = await this.followService.unfollowFromRequest(Number(req.user.id), task)
    res.send(result)
  }

  async archive(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)

    const task = await this.taskService.getById(taskId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, task ? task : Subjects.Task)

    const result = await this.taskService.archive(taskId)
    res.send(result)
  }

  async restore(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)

    const task = await this.taskService.getArchivedById(taskId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, task ? task : Subjects.Task)

    const result = await this.taskService.restore(taskId)
    res.send(result)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)

    const result = await this.taskService.remove(taskId)
    res.send(result)
  }

  // Assignees
  async assigneeAdd(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)
    const userId = Number(req.params.userId)

    const task = await this.taskService.assigneeAdd(taskId, userId)
    res.send(this.responseData(task))
  }

  async assigneeRemove(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)
    const userId = Number(req.params.userId)

    const task = await this.taskService.assigneeRemove(taskId, userId)
    res.send(this.responseData(task))
  }

  // Tags
  async tagAdd(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)
    const tagId = Number(req.params.tagId)

    const task = await this.taskService.tagAdd(taskId, tagId)
    res.send(this.responseData(task))
  }

  async tagRemove(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)
    const tagId = Number(req.params.tagId)

    const task = await this.taskService.tagRemove(taskId, tagId)
    res.send(this.responseData(task))
  }
}
