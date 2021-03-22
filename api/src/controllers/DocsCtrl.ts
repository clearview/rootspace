import { Request, Response } from 'express'
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

  async view(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, doc ? doc : Subjects.Doc)

    res.send(this.responseData(doc))
  }

  async history(req: Request, res: Response) {
    const doc = await this.docService.getDocRevisons(Number(req.params.id))
    const resData = this.responseData(doc)

    res.send(resData)
  }

  async create(req: Request, res: Response) {
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Create, Subjects.Doc)

    const data = req.body.data
    await validateDocCreate(data)

    let value = DocCreateValue.fromObjectAndUserId(data, req.user.id)

    if (data.config) {
      value = value.withNodeConfig(data.config)
    }

    const result = await this.docService.create(value)

    res.send(this.responseData(result))
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    await validateDocUpdate(data)

    const doc = await this.docService.requireById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Update, doc)

    const value = DocUpdateValue.fromObject(data)
    const result = await this.docService.update(value, doc.id, req.user.id)

    res.send(this.responseData(result))
  }

  async restoreRevision(req: Request, res: Response) {
    const result = await this.docService.restoreRevision(Number(req.params.revisionId), req.user.id)
    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, doc)

    const result = await this.docService.archive(doc.id, req.user.id)
    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id), { withDeleted: true })
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, doc)

    const result = await this.docService.restore(doc.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id), { withDeleted: true })
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, doc)

    const result = await this.docService.remove(doc.id, req.user.id)
    res.send(this.responseData(result))
  }

  async follow(req: Request, res: Response) {
    const doc = await this.docService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, doc ? doc : Subjects.Doc)

    const result = await this.followService.followFromRequest(req.user.id, doc)
    res.send(this.responseData(result))
  }

  async unfollow(req: Request, res: Response) {
    const doc = await this.docService.getById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, doc ? doc : Subjects.Doc)

    const result = await this.followService.unfollowFromRequest(req.user.id, doc)
    res.send(this.responseData(result))
  }
}
