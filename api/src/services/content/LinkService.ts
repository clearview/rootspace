import { getCustomRepository } from 'typeorm'
import { LinkRepository } from '../../database/repositories/LinkRepository'
import { Link } from '../../database/entities/Link'
import { LinkCreateValue, LinkUpdateValue } from '../../values/link'
import { NodeType } from '../../types/node'
import { NodeCreateValue } from '../../values/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { ServiceFactory } from '../factory/ServiceFactory'

export class LinkService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  private static instance: LinkService

  static getInstance() {
    if (!LinkService.instance) {
      LinkService.instance = new LinkService()
    }

    return LinkService.instance
  }

  getNodeType(): NodeType {
    return NodeType.Link
  }

  getLinkRepository(): LinkRepository {
    return getCustomRepository(LinkRepository)
  }

  getLinkById(id: number, spaceId: number = null, options: any = {}): Promise<Link> {
    return this.getLinkRepository().getById(id, spaceId, options)
  }

  async requireLinkById(id: number, spaceId: number = null, options: any = {}): Promise<Link> {
    const link = await this.getLinkById(id, spaceId, options)

    if (!link) {
      throw clientError('Link not found', HttpErrName.EntityNotFound)
    }

    return link
  }

  async create(data: LinkCreateValue): Promise<Link> {
    const link = await this.getLinkRepository().save(data.attributes)

    await this.nodeService.create(
      NodeCreateValue.fromObject({
        userId: link.userId,
        spaceId: link.spaceId,
        contentId: link.id,
        title: link.title,
        type: NodeType.Link,
      })
    )

    return link
  }

  async update(data: LinkUpdateValue, id: number): Promise<Link> {
    let link = await this.getLinkById(id)

    if (!link) {
      throw clientError('Error updating link')
    }

    Object.assign(link, data.attributes)
    link = await this.getLinkRepository().save(link)

    await this.nodeContentMediator.contentUpdated(link.id, this.getNodeType(), {
      title: link.title,
    })

    return link
  }

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
    const link = await this.getLinkById(contentId)

    if (!link) {
      return
    }

    link.title = data.title
    await this.getLinkRepository().save(link)
  }

  async archive(id: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    this.verifyArchive(link)

    link = await this._archive(link)

    await this.nodeService.contentArchived(link.id, this.getNodeType())
    return link
  }

  async nodeArchived(contentId: number): Promise<void> {
    const link = await this.getLinkById(contentId)

    if (!link) {
      return
    }

    await this._archive(link)
  }

  private _archive(link: Link): Promise<Link> {
    return this.getLinkRepository().softRemove(link)
  }

  async restore(id: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    this.verifyRestore(link)

    link = await this._restore(link)

    await this.nodeContentMediator.contentRestored(link.id, this.getNodeType())
    return link
  }

  async nodeRestored(contentId: number): Promise<void> {
    const link = await this.getLinkById(contentId, null, { withDeleted: true })

    if (!link) {
      return
    }

    await this._restore(link)
  }

  private _restore(link: Link): Promise<Link> {
    return this.getLinkRepository().recover(link)
  }

  async remove(id: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    // this.verifyRemove(link)

    link = await this.getLinkRepository().remove(link)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return link
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const link = await this.getLinkById(contentId, null, { withDeleted: true })
    await this.getLinkRepository().remove(link)
  }

  private verifyArchive(link: Link): void {
    if (link.deletedAt !== null) {
      throw clientError('Can not archive link', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(link: Link) {
    if (link.deletedAt === null) {
      throw clientError('Can not restore link', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(link: Link): void {
    if (link.deletedAt === null) {
      throw clientError('Can not delete link', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }
}
