import { getCustomRepository } from 'typeorm'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'

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
}
