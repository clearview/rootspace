import { EntityRepository, getConnection, Repository } from 'typeorm'
import { Upload } from '../entities/Upload'

@EntityRepository(Upload)
export class UploadRepository extends Repository<Upload> {
  getByEntityId(entityId: number, entity: string): Promise<Upload | undefined> {
    return this.createQueryBuilder('upload')
      .where('upload.entityId = :entityId', { entityId })
      .andWhere('upload.entity = :entity', { entity })
      .getOne()
  }

  async getEntityFromUpload(upload: Upload): Promise<any> {
    return getConnection()
      .getRepository(upload.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: upload.entityId})
      .getOne()
  }
}
