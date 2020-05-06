import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { LinkType } from '../constants'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { validateLinkCreate, validateLinkUpdate } from '../validation/link'
import { LinkService } from '../services/LinkService'
import { ContentManager } from '../services/content/ContentManager'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService
  protected contentManager: ContentManager

  constructor() {
    super()
    this.linkSrvice = LinkService.getInstance()
    this.contentManager = ContentManager.getInstance()
  }

  public async view(req: Request, res: Response) {
    const link = await this.linkSrvice.getLinkById(Number(req.params.id))
    const content = this.responseData(link)

    if (link.type !== LinkType.Link) {
      const linkContent = await this.contentManager.getLinkContent(link)
      content.includes(linkContent, link.type)
    }

    res.send(content)
  }

  public async listAll(req: Request, res: Response) {
    const links = await this.linkSrvice.getAll()
    const data = this.responseData(links)

    res.send(data)
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateLinkCreate(data)

      const value = LinkCreateValue.fromObjectAndUserId(
        data,
        Number(req.user.id)
      )

      const link = await this.linkSrvice.create(value)
      const resData = this.responseData(link)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = req.body.data

      await validateLinkUpdate(data)

      const value = LinkUpdateValue.fromObject(data)
      const result = await this.linkSrvice.update(value, id)

      res.send(result)
    } catch (err) {
      next(err)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.linkSrvice.delete(Number(req.params.id))
      res.send(result)
    } catch (err) {
      next(err)
    }
  }
}
