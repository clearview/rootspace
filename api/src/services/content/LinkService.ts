import { getCustomRepository, DeleteResult } from 'typeorm'
import { LinkRepository } from '../../database/repositories/LinkRepository'
import { Link } from '../../database/entities/Link'
import { LinkCreateValue, LinkUpdateValue } from '../../values/link'
import { NodeType } from '../../types/node'
import { NodeCreateValue } from '../../values/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'

export class LinkService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = NodeService.getInstance()
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

  getLinkById(id: number, spaceId?: number): Promise<Link> {
    return this.getLinkRepository().getById(id, spaceId)
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

    this.mediator.contentUpdated(link.id, this.getNodeType(), {
      title: link.title,
    })

    return link
  }

  async delete(id: number): Promise<DeleteResult> {
    const link = await this.getLinkById(id)

    if (!link) {
      throw clientError(
        'Error deleting link',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
    }

    const res = await this.getLinkRepository().delete({
      id,
    })

    if (res.affected > 0) {
      this.mediator.contentRemoved(link.id, this.getNodeType())
    }

    return res
  }

  async nodeUpdated(
    contentId: number,
    data: INodeContentUpdate
  ): Promise<void> {
    const link = await this.getLinkById(contentId)

    if (!link) {
      return
    }

    link.title = data.title
    await this.getLinkRepository().save(link)
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const link = await this.getLinkRepository().findOne({id: contentId})
    await this.getLinkRepository().remove(link)
  }
}
