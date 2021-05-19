import { Brackets, EntityRepository } from 'typeorm'
import { QueryOptions } from '../../shared/types/DBQueryOptions'
import { UploadsFilter } from '../../shared/types/UploadsFilter'
import { Upload } from '../entities/Upload'
import { BaseRepository } from './BaseRepository'

@EntityRepository(Upload)
export class UploadRepository extends BaseRepository<Upload> {
  getUploadByEntity(entity: string, entityId: number): Promise<Upload | undefined> {
    return this.createQueryBuilder('upload')
      .where('upload.entityId = :entityId', { entityId })
      .andWhere('upload.entity = :entity', { entity })
      .getOne()
  }

  getUploadsByEntity(
    entity: string,
    entityId: number,
    filter: UploadsFilter = {},
    options: QueryOptions = {}
  ): Promise<Upload[]> {
    const query = this.createQueryBuilder('upload')
      .leftJoinAndSelect('upload.user', 'user')
      .where('upload.entityId = :entityId', { entityId })
      .andWhere('upload.entity = :entity', { entity })

    if (filter.search !== undefined) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('upload.name ILIKE :name', { name: `%${filter.search}%` })
          qb.orWhere('upload.filename ILIKE :filename', { filename: `%${filter.search}%` })
        })
      )
    }

    if (options.offset) {
      query.offset(options.offset)
    }

    if (options.limit) {
      query.limit(options.limit)
    }

    return query.getMany()
  }
}
