import { NextFunction, Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateDocCreate, validateDocUpdate, DocCreateValue, DocUpdateValue } from '../services/content/doc'
import { contentPermissions, hasContentPermission } from '../services/content-access'
import { DocService, FollowService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'

export class DocsCtrl extends BaseCtrl {
  private docService: DocService
  private followService: FollowService

  constructor() {
    super()
    this.docService = ServiceFactory.getInstance().getDocService()
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  async publicView(req: Request, res: Response, next: NextFunction) {
    let id: number | string = req.params.id
    id = isNaN(Number(id)) ? id : Number(id)

    if (typeof id === 'number') {
      return next()
    }

    const doc = await this.docService.requireById(id)
    const permissions = await contentPermissions(doc)

    if (permissions.has('view') === false) {
      throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    permissions.throwUnlessHas('view')

    res.send(
      this.responseBody(doc)
        .with('contentAccess', permissions.getContentAccess())
        .with('permissions', permissions.getList())
    )
  }
  async authenticatedView(req: Request, res: Response) {
    const id = Number(req.params.id)
    const doc = await this.docService.requireById(id)
    const permissions = await contentPermissions(doc, req.user?.id)

    permissions.throwUnlessHas('view')

    res.send(
      this.responseBody(doc)
        .with('contentAccess', permissions.getContentAccess())
        .with('permissions', permissions.getList())
    )
  }

  async history(req: Request, res: Response) {
    const doc = await this.docService.getDocRevisons(Number(req.params.id))
    const resData = this.responseData(doc)

    res.send(resData)
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateDocCreate(data)

    let value = DocCreateValue.fromObjectAndUserId(data, req.user.id)

    if (data.config) {
      value = value.withNodeConfig(data.config)
    }

    const doc = await this.docService.create(value)
    const permissions = await contentPermissions(doc, req.user.id)

    res.send(
      this.responseBody(doc)
        .with('contentAccess', permissions.getContentAccess())
        .with('permissions', permissions.getList())
    )
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    await validateDocUpdate(data)

    const doc = await this.docService.requireById(Number(req.params.id))
    await hasContentPermission('update', doc, req.user.id)

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
    await hasContentPermission('archive', doc, req.user.id)

    const result = await this.docService.archive(doc.id, req.user.id)
    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id), { withDeleted: true })
    await hasContentPermission('restore', doc, req.user.id)

    const result = await this.docService.restore(doc.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id), { withDeleted: true })
    await hasContentPermission('delete', doc, req.user.id)

    const result = await this.docService.remove(doc.id, req.user.id)
    res.send(this.responseData(result))
  }

  async follow(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id))
    await hasContentPermission('view', doc, req.user.id)

    const result = await this.followService.followFromRequest(req.user.id, doc)
    res.send(this.responseData(result))
  }

  async unfollow(req: Request, res: Response) {
    const doc = await this.docService.requireById(Number(req.params.id))
    const result = await this.followService.unfollowFromRequest(req.user.id, doc)

    res.send(this.responseData(result))
  }
}
