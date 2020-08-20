import { EntityRepository, Repository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Doc } from '../entities/Doc'

@EntityRepository(Doc)
export class DocRepository extends BaseRepository<Doc> {
  async getById(id: number, options: any = {}): Promise<Doc> {
    const query = this.createQueryBuilder('doc').where('doc.id = :id', { id })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }
}
