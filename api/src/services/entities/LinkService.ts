import { getCustomRepository, getTreeRepository } from 'typeorm'
import { LinkRepository } from '../../repositories/LinkRepository'
import { Link } from '../../entities/Link'
import { LinkCreateValue, LinkUpdateValue } from '../../values/link'

export class LinkService {
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

  update(data: LinkUpdateValue, id: number) {
    return this.getLinkRepository().update(id, data.toObject())
  }

  delete(id: number) {
    return this.getLinkRepository().delete({
      id,
    })
  }
}
