import { EntityRepository, Repository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Doc } from '../entities/Doc'

@EntityRepository(Doc)
export class DocRepository extends BaseRepository<Doc> {
  async getById(id: number | string, options: any = {}): Promise<Doc> {
    const query = this.createQueryBuilder('doc')

    if (typeof id === 'number') {
      query.where('doc.id = :id', { id })
    } else {
      query.where('doc.publicId = :publicId', { publicId: id })
    }

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }
}
