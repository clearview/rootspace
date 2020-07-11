import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Follow } from '../database/entities/Follow'

@EntityRepository(Follow)
export class FollowRepository extends BaseRepository<Follow> {}
