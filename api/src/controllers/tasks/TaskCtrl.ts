import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskService } from '../../services'
import { FollowService } from '../../services/FollowService'
import { Actions, Subjects } from '../../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'

export class TaskCtrl extends BaseCtrl {
  private taskService: TaskService
  private followService: FollowService

  constructor() {
    super()
    this.taskService = TaskService.getInstance()
    this.followService = FollowService.getInstance()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.getById(Number(req.params.id))

    const resData = this.responseData(task)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    data.user = req.user

    const task = await this.taskService.create(data)

    const resData = this.responseData(task)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.update(Number(req.params.id), req.body.data)

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
    const task = await this.taskService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, task ? task : Subjects.Task)

    const result = await this.taskService.archive(Number(req.params.id))
    res.send(result)
  }

  async restore(req: Request, res: Response, next: NextFunction) {
    const task = await this.taskService.getArchivedById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, task ? task : Subjects.Task)

    const result = await this.taskService.restore(Number(req.params.id))
    res.send(result)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.taskService.remove(Number(req.params.id))
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
