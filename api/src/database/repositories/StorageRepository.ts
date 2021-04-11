import { EntityRepository } from 'typeorm'
import { Storage } from '../entities/Storage'
import { BaseRepository } from './BaseRepository'
import { Upload } from '../entities/Upload'

@EntityRepository(Storage)
export class StorageRepository extends BaseRepository<Storage> {
  getById(id: number, options: any = {}): Promise<Storage | undefined> {
    const query = this.createQueryBuilder('Storage').where('Storage.id = :id', { id })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }

  getByIdWithUploads(id: number, options: any = {}): Promise<Storage | undefined> {
    return this.createQueryBuilder('storage')
      .where('storage.id = :id', { id })
      .leftJoinAndMapMany(
        'storage.uploads',
        Upload,
        'upload',
        'upload.entityId = storage.id AND upload.entity = :entity',
        {
          entity: 'Storage',
        }
      )
      .getOne()
  }
}
