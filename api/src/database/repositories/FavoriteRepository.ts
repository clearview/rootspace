import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Favorite } from '../entities/Favorite'

@EntityRepository(Favorite)
export class FavoriteRepository extends BaseRepository<Favorite> {
  getByNodeIdAndUserId(nodeId: number, userId: number): Promise<Favorite | undefined> {
    return this.createQueryBuilder('favorite')
      .where('favorite.nodeId = :nodeId', { nodeId })
      .andWhere('favorite.userId = :userId', { userId })
      .getOne()
  }
}
