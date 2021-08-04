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

  getByUserIdAndSpaceId(userId: number, spaceId: number): Promise<Storage | undefined> {
    const query = this.createQueryBuilder('Storage')
      .where('Storage.userId = :userId', { userId })
      .andWhere('Storage.spaceId = :spaceId', { spaceId })

    return query.getOne()
  }
}
