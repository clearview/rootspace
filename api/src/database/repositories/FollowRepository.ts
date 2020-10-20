import { BaseRepository } from './BaseRepository'
import { EntityRepository, DeleteResult } from 'typeorm'
import { Follow } from '../entities/Follow'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {
  deleteByEntityAndEntityId(entity: string, entityId: number): Promise<DeleteResult> {
    return this.createQueryBuilder('follow')
      .delete()
      .where('entity = :entity', { entity })
      .andWhere('entityId = :entityId', { entityId })
      .execute()
  }
}
