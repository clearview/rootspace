import { Request, Response } from 'express'
import { getCustomRepository, getTreeRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'
import { LinkService } from '../services/LinkService'
import { LinkType, getLinkContent } from '../lib/link'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService

  constructor() {
    super()
    this.linkSrvice = new LinkService()
  }

  public async view(req: Request, res: Response) {
    const link = await this.linkSrvice.getLinkById(Number(req.params.id))

    const content = this.responseContent(link)

    if (link.type !== LinkType.Link) {
      const linkContent = await getLinkContent(link)
      content.includes(linkContent, link.type)
    }

    res.send(content)
  }

  public async listAll(req: Request, res: Response) {
    const links = await getTreeRepository(Link).findTrees()
    const content = this.responseContent(links)

    res.send(content)
  }

  public async create(req: Request, res: Response) {
    const validData: object = {
      userId: req.user.id,
    }
    const data = Object.assign(req.body, validData)

    if (data.parent) {
      const parent = await getCustomRepository(LinkRepository).findOne(
        Number(data.parent)
      )
      data.parent = parent
    }

    const space = getCustomRepository(LinkRepository).create(data)
    const newSpace = await getCustomRepository(LinkRepository).save(space)
    res.send(newSpace)
  }

  public async update(req: Request, res: Response) {
    const space = await getCustomRepository(LinkRepository).update(
      Number(req.params.id),
      req.body
    )
    return this.view(req, res)
  }

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(LinkRepository).delete({
      id: Number(req.params.id),
    })
    res.send({ deleted: true })
  }
}
