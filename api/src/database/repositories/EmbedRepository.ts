import { EntityRepository } from 'typeorm'
import { Embed } from '../entities/Embed'
import { BaseRepository } from './BaseRepository'

@EntityRepository(Embed)
export class EmbedRepository extends BaseRepository<Embed> {
  getById(id: number, options: any = {}) {
    const query = this.createQueryBuilder('embed').where('embed.id = :id', { id })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }
}
