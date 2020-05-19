import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { ContentManager } from './content/ContentManager'
import { clientError } from '../errors/client'

export class LinkService {
  private contentManager: ContentManager

  private static instance: LinkService

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  static getInstance() {
    if (!LinkService.instance) {
      LinkService.instance = new LinkService()
    }

    return LinkService.instance
  }

  getLinkRepository(): LinkRepository {
    return getCustomRepository(LinkRepository)
  }

  getLinkById(id: number): Promise<Link> {
    return this.getLinkRepository().findOne(id)
  }

  getLinkByValue(value: string): Promise<Link> {
    return this.getLinkRepository().findOne({ where: { value } })
  }

  getAll(spaceId: number) {
    return this.getLinkRepository().getTreeBySpaceId(spaceId)
  }

  getMaxPositionByParentId(parentId: number | null): Promise<number> {
    return this.getLinkRepository().getMaxPositionByParentId(parentId)
  }

  async getNextPositionByParentId(parentId: number | null): Promise<number> {
    let position = await this.getMaxPositionByParentId(parentId)
    return ++position
  }

  async create(data: LinkCreateValue): Promise<Link> {
    const link = this.getLinkRepository().create()

    Object.assign(link, data.getAttributes())

    if (data.parent) {
      const parent = await this.getLinkById(Number(data.parent))
      link.parent = parent
    }

    link.position = link.parent
      ? await this.getNextPositionByParentId(link.parent.id)
      : await this.getNextPositionByParentId(null)

    return this.getLinkRepository().save(link)
  }

  async update(data: LinkUpdateValue, id: number): Promise<Link> {
    let link = await this.getLinkById(id)

    if (!link) {
      throw clientError('Error updating link')
    }

    Object.assign(link, data.getAttributes())

    await this.getLinkRepository().save(link)
    await this.contentManager.updateContentByLink(link)

    if (data.parent !== undefined) {
      link = await this.updateLinkParent(link, data.parent)
    }

    if (data.position !== undefined) {
      link = await this.updateLinkPosition(link, data.position)
    }

    return link
  }

  async updateByContent(
    data: LinkUpdateValue,
    id: number
  ): Promise<UpdateResult> {
    return this.getLinkRepository().update(id, data.getAttributes())
  }

  async updateLinkParent(link: Link, toParentId: number | null): Promise<Link> {
    const rawLink = await this.getLinkRepository().getRawById(link.id)

    const exParentId = rawLink.link_parentId
    const exPosition = link.position

    if (toParentId === exParentId) {
      return link
    }

    const parent = toParentId ? await this.getLinkById(toParentId) : null

    if (parent === undefined) {
      throw clientError('Cant not find parent ' + toParentId)
    }

    link.parent = parent
    link.position = await this.getNextPositionByParentId(toParentId)

    link = await this.getLinkRepository().save(link)

    await this.getLinkRepository().decreasePositions(exParentId, exPosition)

    return link
  }

  async updateLinkPosition(link: Link, toPosition: number): Promise<Link> {
    const rawLink = await this.getLinkRepository().getRawById(link.id)

    const linkParentId = rawLink.link_parentId
    const fromPosition = link.position

    if (toPosition === link.position) {
      return link
    }

    const maxPosition = await this.getMaxPositionByParentId(linkParentId)

    if (toPosition > maxPosition) {
      toPosition = maxPosition
    }

    if (toPosition > fromPosition) {
      await this.getLinkRepository().decreasePositions(
        linkParentId,
        fromPosition,
        toPosition
      )
    }

    if (toPosition < fromPosition) {
      await this.getLinkRepository().increasePositions(
        linkParentId,
        toPosition,
        fromPosition
      )
    }

    link.position = toPosition
    return this.getLinkRepository().save(link)
  }

  async delete(id: number) {
    const link = await this.getLinkById(id)

    if (!link) {
      throw clientError('Error deleting link')
    }

    const res = await this.getLinkRepository().delete({
      id,
    })

    if (res.affected > 0) {
      this.contentManager.deleteContentByLink(link)
    }

    return res
  }

  deleteByContent(id: number): Promise<DeleteResult> {
    return this.getLinkRepository().delete({
      id,
    })
  }
}
