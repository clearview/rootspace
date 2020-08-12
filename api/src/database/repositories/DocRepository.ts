import { EntityRepository, Repository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Doc } from '../entities/Doc'

@EntityRepository(Doc)
export class DocRepository extends BaseRepository<Doc> {
  async findOneArchived(id: number): Promise<Doc> {
    return this
      .createQueryBuilder('doc')
      .where('doc.id = :id', { id })
      .withDeleted()
      .getOne()
  }
}
