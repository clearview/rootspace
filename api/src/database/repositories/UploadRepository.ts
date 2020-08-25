import { EntityRepository, Repository } from 'typeorm'
import { Upload } from '../entities/Upload'

@EntityRepository(Upload)
export class UploadRepository extends Repository<Upload> {
  getByEntityId(entityId: number, entity: string): Promise<Upload | undefined> {
    return this.createQueryBuilder('upload')
      .where('upload.entityId = :entityId', { entityId })
      .andWhere('upload.entity = :entity', { entity })
      .getOne()
  }
}
