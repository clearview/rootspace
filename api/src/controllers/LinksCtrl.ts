import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { LinkCreateValue, LinkUpdateValue, validateLinkCreate, validateLinkUpdate } from '../services/content/link'
import { LinkService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService

  constructor() {
    super()
    this.linkSrvice = ServiceFactory.getInstance().getLinkservice()
  }

  public async view(req: Request, res: Response) {
    const link = await this.linkSrvice.requireLinkById(Number(req.params.id))
    this.isSpaceMember(req, link.spaceId)

    res.send(this.responseData(link))
  }

  public async create(req: Request, res: Response) {
    const data = req.body.data
    await validateLinkCreate(data)

    this.isSpaceMember(req, data.spaceId)

    const value = LinkCreateValue.fromObjectAndUserId(data, req.user.id)

    const result = await this.linkSrvice.create(value)
    res.send(this.responseData(result))
  }

  public async update(req: Request, res: Response) {
    const data = req.body.data
    await validateLinkUpdate(data)

    const link = await this.linkSrvice.requireLinkById(Number(req.params.id))
    this.isSpaceMember(req, link.spaceId)

    const value = LinkUpdateValue.fromObject(data)
    const result = await this.linkSrvice.update(value, link.id, req.user.id)

    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const link = await this.linkSrvice.requireLinkById(Number(req.params.id))
    this.isSpaceMember(req, link.spaceId)

    const result = await this.linkSrvice.archive(link.id, req.user.id)
    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const link = await this.linkSrvice.requireLinkById(Number(req.params.id))
    this.isSpaceMember(req, link.spaceId)

    const result = await this.linkSrvice.restore(link.id, req.user.id)
    res.send(this.responseData(result))
  }

  public async delete(req: Request, res: Response) {
    const link = await this.linkSrvice.requireLinkById(Number(req.params.id))
    this.isSpaceMember(req, link.spaceId)

    const result = await this.linkSrvice.remove(link.id, req.user.id)
    res.send(this.responseData(result))
  }
}
