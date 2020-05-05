import { getCustomRepository } from 'typeorm'
import { LinkRepository } from '../../repositories/LinkRepository'
import { Link } from '../../entities/Link'
import { LinkCreateValue } from '../../values/link/LinkCreateValue'
import { LinkUpdateValue } from '../../values/link/LinkUpdateValue'

export class LinkService {
  getLinkRepository(): LinkRepository {
    return getCustomRepository(LinkRepository)
  }

  async getLinkById(id: number): Promise<Link> {
    return await this.getLinkRepository().findOne(id)
  }

  async getLinkByValue(value: string): Promise<Link> {
    return await this.getLinkRepository().findOne({ where: { value } })
  }

  async create(data: LinkCreateValue) {
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
    return this.getLinkRepository().update(id, data.toObject())
  }
}
