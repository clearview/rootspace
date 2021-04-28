import { getCustomRepository } from 'typeorm'
import { LinkRepository } from '../../../database/repositories/LinkRepository'
import { Link } from '../../../database/entities/Link'
import { Node } from '../../../database/entities/Node'
import { LinkCreateValue, LinkUpdateValue } from './values'
import { NodeType } from '../../../shared/constants'
import { NodeCreateValue } from '../node/values'
import { NodeService } from '../node/NodeService'
import { NodeContentService } from '../NodeContentService'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../../../response/errors'
import { LinkActivity } from '../../activity/activities/content'

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

  getNodeType(): string {
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

  async create(data: LinkCreateValue): Promise<Node & Link> {
    let link = await this.getLinkRepository().save(data.attributes)

    let value = NodeCreateValue.fromObject({
      userId: link.userId,
      spaceId: link.spaceId,
      contentId: link.id,
      title: link.title,
      type: NodeType.Link,
    })

    if (data.attributes.parentId) {
      value = value.withParent(data.attributes.parentId).withPosition(0)
    }
    const node = await this.nodeService.create(value)

    link = await this.getLinkRepository().reload(link)
    await this.notifyActivity(LinkActivity.created(link, link.userId))

    return { ...link, ...node }
  }

  async update(data: LinkUpdateValue, id: number, actorId: number): Promise<Link> {
    const link = await this.requireLinkById(id)
    const updatedLink = await this._update(data, link, actorId)

    if (link.title !== updatedLink.title) {
      await this.nodeContentMediator.contentUpdated(updatedLink.id, this.getNodeType(), actorId, {
        title: updatedLink.title,
      })
    }

    return updatedLink
  }

  async nodeUpdated(node: Node, actorId: number): Promise<void> {
    const link = await this.getLinkById(node.contentId)

    if (!link) {
      return
    }

    await this._update(
      LinkUpdateValue.fromObject({
        title: node.title,
      }),
      link,
      actorId
    )
  }

  private async _update(data: LinkUpdateValue, link: Link, actorId: number): Promise<Link> {
    let updatedLink = await this.requireLinkById(link.id)

    Object.assign(updatedLink, data.attributes)
    updatedLink = await this.getLinkRepository().save(updatedLink)

    await this.notifyActivity(LinkActivity.updated(link, updatedLink, actorId))

    return updatedLink
  }

  async archive(id: number, actorId: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    this.verifyArchive(link)

    link = await this._archive(link, actorId)

    await this.nodeService.contentArchived(link.id, this.getNodeType(), actorId)
    return link
  }

  async nodeArchived(node: Node, actorId: number): Promise<void> {
    const link = await this.getLinkById(node.contentId)

    if (!link) {
      return
    }

    await this._archive(link, actorId)
  }

  private async _archive(link: Link, actorId: number): Promise<Link> {
    link = await this.getLinkRepository().softRemove(link)
    await this.notifyActivity(LinkActivity.archived(link, actorId))

    return link
  }

  async restore(id: number, actorId: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    this.verifyRestore(link)

    link = await this._restore(link, actorId)

    await this.nodeContentMediator.contentRestored(link.id, this.getNodeType(), actorId)
    return link
  }

  async nodeRestored(node: Node, actorId: number): Promise<void> {
    const link = await this.getLinkById(node.contentId, null, { withDeleted: true })

    if (!link) {
      return
    }

    await this._restore(link, actorId)
  }

  private async _restore(link: Link, actorId: number): Promise<Link> {
    link = await this.getLinkRepository().recover(link)
    await this.notifyActivity(LinkActivity.restored(link, actorId))
    return link
  }

  async remove(id: number, actorId: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    // this.verifyRemove(link)

    link = await this._remove(link, actorId)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType(), actorId)

    return link
  }

  async nodeRemoved(node: Node, actorId: number): Promise<void> {
    const link = await this.getLinkById(node.contentId, null, { withDeleted: true })

    if (link) {
      await this._remove(link, actorId)
    }
  }

  private async _remove(link: Link, actorId: number): Promise<Link> {
    await this.notifyActivity(LinkActivity.deleted(link, actorId))
    return this.getLinkRepository().remove(link)
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
