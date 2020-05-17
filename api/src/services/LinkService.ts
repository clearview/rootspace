import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { ContentManager } from './content/ContentManager'
import { clientError } from '../errors/httpError'

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

  async create(data: LinkCreateValue): Promise<Link> {
    const link = this.getLinkRepository().create()

    Object.assign(link, data.getAttributes())

    if (data.parent) {
      const parent = await this.getLinkById(Number(data.parent))
      link.parent = parent
    }

    return this.getLinkRepository().save(link)
  }

  async update(data: LinkUpdateValue, id: number): Promise<Link> {
    const link = await this.getLinkById(id)

    if (!link) {
      throw clientError('Error updating link')
    }

    Object.assign(link, data.getAttributes())

    if (data.parent !== undefined) {
      const parentId = Number(data.parent)

      link.parent = parentId
        ? await this.getLinkById(parentId)
        : null
    }

    await this.getLinkRepository().save(link)
    await this.contentManager.updateContentByLink(link)

    return link
  }

  async updateByContent(
    data: LinkUpdateValue,
    id: number
  ): Promise<UpdateResult> {
    return this.getLinkRepository().update(id, data.getAttributes())
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
