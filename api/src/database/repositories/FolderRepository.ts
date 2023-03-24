import { EntityRepository } from 'typeorm'
import { Folder } from '../entities/Folder'
import { BaseRepository } from './BaseRepository'

@EntityRepository(Folder)
export class FolderRepository extends BaseRepository<Folder> {
  getById(id: number, options: any = {}): Promise<Folder | undefined> {
    const query = this.createQueryBuilder('folder').where('folder.id = :id', { id })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }
}
