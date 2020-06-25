import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from '../BaseCtrl'
import { TaskBoardTagService } from '../../services/content/tasks/TaskBoardTagService'
import { Tag } from '../../entities/tasks/Tag'
import { TaskBoardService } from '../../services/content/tasks'

export class TaskBoardTagCtrl extends BaseCtrl {
  private taskBoardService: TaskBoardService
  private tagService: TaskBoardTagService

  constructor() {
    super()
    this.taskBoardService = TaskBoardService.getInstance()
    this.tagService = TaskBoardTagService.getInstance()
  }

  async list(req: Request, res: Response, next: NextFunction) {
    const tags = await this.taskBoardService.getById(Number(req.params.id))

    const resData = this.responseData(tags)
    res.send(resData)
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const tag = await this.tagService.getById(Number(req.params.id))

    const resData = this.responseData(tag)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    const taskBoard = await this.taskBoardService.getById(Number(req.params.id))

    // const tag = new Tag({ board: taskBoard, label: data.label, color: data.color })
    const tag = new Tag()
    tag.board = taskBoard
    tag.label = data.label
    tag.color = data.color

    const resData = await this.tagService.create(tag)
    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let tag = await this.tagService.getById(Number(req.params.id))

    const data = req.body.data
    tag = await this.tagService.update(tag.id, data)

    res.send(this.responseData(tag))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.tagService.delete(Number(req.params.id))
    res.send(result)
  }
}
