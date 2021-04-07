import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { ContentAccess } from '../entities/ContentAccess'

@EntityRepository(ContentAccess)
export class ContentAccessRepository extends BaseRepository<ContentAccess> {
  getForEntity(entityId: number, entity: string): Promise<ContentAccess> {
    const query =  this.createQueryBuilder('contentAccess')
    .where('contentAccess.entityId = :entityId AND contentAccess.entity = :entity', { entityId, entity })

    return query.getOne()
  }
}
