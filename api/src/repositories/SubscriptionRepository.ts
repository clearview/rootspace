import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Subscription } from '../database/entities/Subscription'

@EntityRepository(Subscription)
export class SubscriptionRepository extends BaseRepository<Subscription> {}
