import { EntityRepository } from 'typeorm'
import { Upload } from '../entities/Upload'
import { BaseRepository } from './BaseRepository'

@EntityRepository(Upload)
export class UploadRepository extends BaseRepository<Upload> {
  getByEntity(entity: string, entityId: number): Promise<Upload | undefined> {
    return this.createQueryBuilder('upload')
      .where('upload.entityId = :entityId', { entityId })
      .andWhere('upload.entity = :entity', { entity })
      .getOne()
  }
}
