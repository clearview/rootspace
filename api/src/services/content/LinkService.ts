import { getCustomRepository } from 'typeorm'
import { LinkRepository } from '../../database/repositories/LinkRepository'
import { Link } from '../../database/entities/Link'
import { Node } from '../../database/entities/Node'
import { LinkCreateValue, LinkUpdateValue } from '../../values/link'
import { NodeType } from '../../types/node'
import { NodeCreateValue } from '../../values/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { ServiceFactory } from '../factory/ServiceFactory'
import { INodeContentUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { LinkActivity } from '../activity/activities/content/LinkActivity'

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
    await this.notifyActivity(LinkActivity.created(link))

    return { ...link, ...node }
  }

  async update(data: LinkUpdateValue, id: number): Promise<Link> {
    const link = await this.requireLinkById(id)
    return this._update(data, link)
  }

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
    const link = await this.getLinkById(contentId)

    if (!link) {
      return
    }

    await this._update(
      LinkUpdateValue.fromObject({
        title: data.title,
      }),
      link
    )
  }

  private async _update(data: LinkUpdateValue, link: Link): Promise<Link> {
    console.log('link title ' + link.title)
    let updatedLink = await this.requireLinkById(link.id)

    Object.assign(updatedLink, data.attributes)
    updatedLink = await this.getLinkRepository().save(updatedLink)

    console.log('udpated link title ' + updatedLink.title)

    await this.nodeContentMediator.contentUpdated(updatedLink.id, this.getNodeType(), {
      title: updatedLink.title,
    })

    await this.notifyActivity(LinkActivity.updated(link, updatedLink))

    return updatedLink
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

  private async _archive(link: Link): Promise<Link> {
    link = await this.getLinkRepository().softRemove(link)
    await this.notifyActivity(LinkActivity.archived(link))

    return link
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

  private async _restore(link: Link): Promise<Link> {
    link = await this.getLinkRepository().recover(link)
    await this.notifyActivity(LinkActivity.restored(link))
    return link
  }

  async remove(id: number): Promise<Link> {
    let link = await this.requireLinkById(id, null, { withDeleted: true })
    // this.verifyRemove(link)

    link = await this._remove(link)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return link
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const link = await this.getLinkById(contentId, null, { withDeleted: true })

    if (link) {
      await this._remove(link)
    }
  }

  private async _remove(link: Link): Promise<Link> {
    await this.notifyActivity(LinkActivity.deleted(link))
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
