import httpRequestContext from 'http-request-context'
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
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { LinkActivities } from '../../database/entities/activities/LinkActivities'
import { ActivityService } from '../ActivityService'

export class LinkService extends NodeContentService {
  private nodeService: NodeService
  private activityService: ActivityService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
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
    let link = await this.getLinkRepository().save(data.attributes)

    await this.nodeService.create(
      NodeCreateValue.fromObject({
        userId: link.userId,
        spaceId: link.spaceId,
        contentId: link.id,
        title: link.title,
        type: NodeType.Link,
      })
    )

    link = await this.getLinkRepository().reload(link)
    await this.registerActivityForLink(LinkActivities.Created, link, { title: link.title })

    return link
  }

  async update(data: LinkUpdateValue, id: number): Promise<Link> {
    let link = await this.getLinkById(id)

    if (!link) {
      throw clientError('Error updating link')
    }

    const existingLink = await this.getLinkById(id)

    Object.assign(link, data.attributes)
    link = await this.getLinkRepository().save(link)

    await this.nodeContentMediator.contentUpdated(link.id, this.getNodeType(), {
      title: link.title,
    })

    const fields = { old: {}, new: {} }

    for (const key of Object.keys(data.attributes)) {
      if (data.attributes[key] !== existingLink[key]) {
        fields.old[key] = existingLink[key]
        fields.new[key] = link[key]
      }
    }

    await this.registerActivityForLink(LinkActivities.Updated, link, fields)

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

  private async _archive(link: Link): Promise<Link> {
    await this.registerActivityForLink(LinkActivities.Archived, link, { title: link.title })
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

  private async _restore(link: Link): Promise<Link> {
    await this.registerActivityForLink(LinkActivities.Restored, link, { title: link.title })
    return this.getLinkRepository().recover(link)
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
    await this.registerActivityForLink(LinkActivities.Deleted, link, { title: link.title })
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

  async registerActivityForLinkId(linkActivity: LinkActivities, linkId: number, context?: any): Promise<Bull.Job> {
    const link = await this.getLinkById(linkId)
    return this.registerActivityForLink(linkActivity, link, context)
  }

  async registerActivityForLink(linkActivity: LinkActivities, link: Link, context?: any): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(linkActivity)
        .fromActor(actor.id)
        .forEntity(link)
        .inSpace(link.spaceId)
        .withContext(context)
    )
  }
}
