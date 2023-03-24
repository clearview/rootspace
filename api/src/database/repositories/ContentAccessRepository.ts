import { EntityRepository, UpdateResult } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BaseRepository } from './BaseRepository'
import { ContentAccess } from '../entities/ContentAccess'

@EntityRepository(ContentAccess)
export class ContentAccessRepository extends BaseRepository<ContentAccess> {
  getByNodeId(nodeId: number): Promise<ContentAccess> {
    return this.createQueryBuilder('contentAccess')
      .where('contentAccess.nodeId = :nodeId ', { nodeId })
      .getOne()
  }

  getByEntityIdAndEntity(entityId: number, entity: string): Promise<ContentAccess> {
    return this.createQueryBuilder('contentAccess')
      .where('contentAccess.entityId = :entityId AND contentAccess.entity = :entity', { entityId, entity })
      .getOne()
  }

  updateByNodeIds(nodeIds: number[], updateSet: QueryDeepPartialEntity<ContentAccess>): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(updateSet)
      .where('nodeId IN (:...nodeIds)', { nodeIds })
      .execute()
  }
}
