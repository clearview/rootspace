import {
  EntityRepository,
  Repository,
} from 'typeorm'
import { Link } from '../database/entities/Link'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  getById(id: number, spaceId?: number) {
    const query = this.createQueryBuilder('link').where('link.id = :id', { id })

    if (spaceId) {
      query.andWhere('link.spaceId = :spaceId', { spaceId })
    }

    return query.getOne()
  }
}
