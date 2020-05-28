import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { ContentManager } from './content/ContentManager'
import { clientError, ClientErrName, ClientStatusCode } from '../errors/client'
import { LinkType } from '../constants'

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

  getLinkById(id: number, spaceId?: number): Promise<Link> {
    return this.getLinkRepository().getById(id, spaceId)
  }

  getLinkByValue(value: string): Promise<Link> {
    return this.getLinkRepository().findOne({ where: { value } })
  }

  getRootLinkBySpaceId(spaceId: number): Promise<Link> {
    return this.getLinkRepository().getRootBySpaceId(spaceId)
  }

  getLinksBySpaceId(spaceId: number): Promise<Link[]> {
    return this.getLinkRepository().getBySpaceId(spaceId)
  }

  getLinkMaxPositionByParentId(parentId: number): Promise<number> {
    return this.getLinkRepository().getMaxPositionByParentId(parentId)
  }

  async getLinkNextPositionByParentId(parentId: number): Promise<number> {
    let position = await this.getLinkMaxPositionByParentId(parentId)
    return ++position
  }

  async createSpaceRoot(data: LinkCreateValue): Promise<Link> {
    const link = this.getLinkRepository().create()

    Object.assign(link, data.getAttributes())

    link.parent = null
    link.position = 0

    return this.getLinkRepository().save(link)
  }

  async create(data: LinkCreateValue): Promise<Link> {
    const link = this.getLinkRepository().create()

    Object.assign(link, data.getAttributes())

    const parent = data.parent
      ? await this.getLinkById(Number(data.parent))
      : await this.getRootLinkBySpaceId(data.spaceId)

    if (!parent) {
      throw clientError('Cant not find parent ' + data.parent)
    }

    link.parent = parent
    link.position = await this.getLinkNextPositionByParentId(parent.id)

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
    const exParentId = link.parentId
    const exPosition = link.position

    if (toParentId === exParentId) {
      return link
    }

    const parent = toParentId
      ? await this.getLinkById(toParentId, link.spaceId)
      : await this.getRootLinkBySpaceId(link.spaceId)

    if (parent === undefined) {
      throw clientError('Cant not find link ' + toParentId)
    }

    if (await this.getLinkRepository().hasDescendant(link, parent.id)) {
      throw clientError('Cant move link into his own descendant ' + toParentId)
    }

    link.parent = parent
    link.position = await this.getLinkNextPositionByParentId(toParentId)
    link = await this.getLinkRepository().save(link)

    await this.getLinkRepository().decreasePositions(exParentId, exPosition)

    return link
  }

  async updateLinkPosition(link: Link, toPosition: number): Promise<Link> {
    const linkParentId = link.parentId
    const fromPosition = link.position

    if (toPosition === link.position) {
      return link
    }

    const maxPosition = await this.getLinkMaxPositionByParentId(linkParentId)

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
      throw clientError(
        'Error deleting link',
        ClientErrName.EntityNotFound,
        ClientStatusCode.NotFound
      )
    }

    if (link.type === LinkType.Root) {
      throw clientError(
        'Can not delete space root link',
        ClientErrName.NotAllowed,
        ClientStatusCode.NotAllowed
      )
    }

    const children = await this.getLinkRepository().getChildrenByParentId(
      link.id
    )

    if (children.length > 0) {
      const parent = await this.getLinkById(link.parentId)

      if (!parent) {
        throw clientError(ClientErrName.EntityDeleteFailed)
      }

      let nextPosition = await this.getLinkNextPositionByParentId(parent.id)

      await Promise.all(
        children.map(
          function(child: Link) {
            child.parent = parent
            child.position = nextPosition++
            return this.getLinkRepository().save(child)
          }.bind(this)
        )
      )
    }

    const res = await this.getLinkRepository().delete({
      id,
    })

    if (res.affected > 0) {
      this.getLinkRepository().decreasePositions(link.parentId, link.position)
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
