import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { validateLinkCreate, validateLinkUpdate } from '../validation/link'
import { LinkService } from '../services/content/LinkService'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { Actions } from '../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService

  constructor() {
    super()
    this.linkSrvice = ServiceFactory.getInstance().getLinkservice()
  }

  public async view(req: Request, res: Response, next: NextFunction) {
    try {
      const link = await this.linkSrvice.getLinkById(Number(req.params.id))
      ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, link)

    if (!link) {
      throw clientError(
        'Not found',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
    }

    const resData = this.responseData(link)
    res.send(resData)
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body.data
    await validateLinkCreate(data)

    const value = LinkCreateValue.fromObjectAndUserId(data, Number(req.user.id))

    const link = await this.linkSrvice.create(value)
    const resData = this.responseData(link)

    res.send(resData)
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateLinkUpdate(data)

    const value = LinkUpdateValue.fromObject(data)
    const link = await this.linkSrvice.update(value, id)

    const resData = this.responseData(link)
    res.send(resData)
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const result = await this.linkSrvice.delete(Number(req.params.id))
    res.send(result)
  }
}
