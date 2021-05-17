import { Brackets, EntityRepository } from 'typeorm'
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

  getUploadsByEntity(entity: string, entityId: number, filter: UploadsFilter = {}): Promise<Upload[]> {
    const query = this.createQueryBuilder('upload')
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

    return query.getMany()
  }
}
