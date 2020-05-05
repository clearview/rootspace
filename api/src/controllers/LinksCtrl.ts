import { Request, Response, NextFunction } from 'express'
import { getCustomRepository, getTreeRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'
import { LinkType } from '../constants'
import { LinkCreateValue } from '../values/link/LinkCreateValue'
import { LinkUpdateValue } from '../values/link/LinkUpdateValue'
import { LinkService } from '../services/entities/LinkService'
import { ContentManager } from '../services/ContentManager'
import { validateLinkCreate, validateLinkUpdate } from '../validation/link'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService
  protected contentManager: ContentManager

  constructor() {
    super()
    this.linkSrvice = new LinkService()
    this.contentManager = new ContentManager()
  }

  public async view(req: Request, res: Response) {
    const link = await this.linkSrvice.getLinkById(Number(req.params.id))
    const content = this.responseContent(link)

    if (link.type !== LinkType.Link) {
      const linkContent = await this.contentManager.getLinkContent(link)
      content.includes(linkContent, link.type)
    }

    res.send(content)
  }

  public async listAll(req: Request, res: Response) {
    const links = await getTreeRepository(Link).findTrees()
    const content = this.responseContent(links)

    res.send(content)
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
      const content = this.responseContent(link)

      res.send(content)
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

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(LinkRepository).delete({
      id: Number(req.params.id),
    })
    res.send({ deleted: true })
  }
}
