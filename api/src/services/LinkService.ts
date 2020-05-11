import {
  getCustomRepository,
  getTreeRepository,
  UpdateResult,
  DeleteResult,
} from 'typeorm'
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

  getLinkTreeRepository() {
    return getTreeRepository(Link)
  }

  getLinkById(id: number): Promise<Link> {
    return this.getLinkRepository().findOne(id)
  }

  getLinkByValue(value: string): Promise<Link> {
    return this.getLinkRepository().findOne({ where: { value } })
  }

  getAll() {
    return this.getLinkTreeRepository().findTrees()
  }

  async create(data: LinkCreateValue): Promise<Link> {
    const link = this.getLinkRepository().create()

    link.userId = data.userId
    link.spaceId = data.spaceId
    link.title = data.title
    link.type = data.type
    link.value = data.value

    if (data.parent) {
      const parent = await this.getLinkById(Number(data.parent))
      link.parent = parent
    }

    return this.getLinkRepository().save(link)
  }

  async update(data: LinkUpdateValue, id: number) {
    let link = await this.getLinkById(id)

    if (!link) {
      throw clientError('Error updating link')
    }

    const res = await this.getLinkRepository().update(id, data.toObject())

    if (res.affected > 0) {
      link = await this.getLinkById(id)
      await this.contentManager.updateContentByLink(link)
    }

    return res
  }

  async updateByContent(
    data: LinkUpdateValue,
    id: number
  ): Promise<UpdateResult> {
    return this.getLinkRepository().update(id, data.toObject())
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
