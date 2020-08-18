import { EntityRepository, Repository } from 'typeorm'
import { Embed } from '../entities/Embed'

@EntityRepository(Embed)
export class EmbedRepository extends Repository<Embed> {
  getById(id: number, options: any = {}) {
    const query = this.createQueryBuilder('embed').where('embed.id = :id', { id })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }
}
