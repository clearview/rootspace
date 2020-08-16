import { EntityRepository, Repository } from 'typeorm'
import { Link } from '../entities/Link'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  getById(id: number, spaceId: number = null, options: any = {}) {
    const query = this.createQueryBuilder('link').where('link.id = :id', { id })

    if (spaceId) {
      query.andWhere('link.spaceId = :spaceId', { spaceId })
    }

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }
}
