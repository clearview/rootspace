import { EntityRepository, getConnection, Repository } from 'typeorm'
import { Upload } from '../entities/Upload'

@EntityRepository(Upload)
export class UploadRepository extends Repository<Upload> {
  getByEntity(entity: string, entityId: number): Promise<Upload | undefined> {
    return this.createQueryBuilder('upload')
      .where('upload.entityId = :entityId', { entityId })
      .andWhere('upload.entity = :entity', { entity })
      .getOne()
  }
}
