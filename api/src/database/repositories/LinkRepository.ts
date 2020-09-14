import { EntityRepository } from 'typeorm'
import { Link } from '../entities/Link'
import { BaseRepository } from './BaseRepository'

@EntityRepository(Link)
export class LinkRepository extends BaseRepository<Link> {
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
