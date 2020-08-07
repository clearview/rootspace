import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateDocCreate, validateDocUpdate } from '../validation/doc'
import { DocCreateValue, DocUpdateValue } from '../values/doc'
import { DocService } from '../services'
import { ForbiddenError } from '@casl/ability'
import { Actions, Subjects } from '../middleware/AuthMiddleware'
import { FollowService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class DocsCtrl extends BaseCtrl {
  private docService: DocService
  private followService: FollowService

  constructor() {
    super()
    this.docService = ServiceFactory.getInstance().getDocService()
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const doc = await this.docService.getById(Number(req.params.id))

    const resData = this.responseData(doc)
    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    await validateDocCreate(data)

    const value = DocCreateValue.fromObjectAndUserId(data, Number(req.user.id))

    const doc = await this.docService.create(value)
    const resData = this.responseData(doc)

    res.send(resData)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateDocUpdate(data)

    const value = DocUpdateValue.fromObject(data)
    const doc = await this.docService.update(value, id)

    res.send(this.responseData(doc))
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const doc = await this.docService.remove(Number(req.params.id))
    res.send(this.responseData(doc))
  }

  async follow(req: Request, res: Response, next: NextFunction) {
    const doc = await this.docService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, doc ? doc : Subjects.Doc)

    const result = await this.followService.followFromRequest(Number(req.user.id), doc)
    res.send(result)
  }

  async unfollow(req: Request, res: Response, next: NextFunction) {
    const doc = await this.docService.getById(Number(req.params.id))

    const result = await this.followService.unfollowFromRequest(Number(req.user.id), doc)
    res.send(result)
  }
}
