import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { validateLinkCreate, validateLinkUpdate } from '../validation/link'
import { LinkService } from '../services/content/LinkService'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'
import { Actions } from '../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService

  constructor() {
    super()
    this.linkSrvice = ServiceFactory.getInstance().getLinkservice()
  }

  public async view(req: Request, res: Response, next: NextFunction) {
    const link = await this.linkSrvice.getLinkById(Number(req.params.id))

    if (!link) {
      throw clientError('Not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, link)

    const resData = this.responseData(link)
    res.send(resData)
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    await validateLinkCreate(data)

    const value = LinkCreateValue.fromObjectAndUserId(data, req.user.id)

    const link = await this.linkSrvice.create(value)
    const resData = this.responseData(link)

    res.send(resData)
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateLinkUpdate(data)

    const value = LinkUpdateValue.fromObject(data)
    const link = await this.linkSrvice.update(value, id, req.user.id)

    const resData = this.responseData(link)
    res.send(resData)
  }

  async archive(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await this.linkSrvice.archive(id, req.user.id)

    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await this.linkSrvice.restore(id, req.user.id)

    res.send(this.responseData(result))
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const link = await this.linkSrvice.remove(id, req.user.id)

    res.send(this.responseData(link))
  }
}
