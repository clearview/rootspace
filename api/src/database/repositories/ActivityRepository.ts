import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Activity } from '../entities/Activity'

@EntityRepository(Activity)
export class ActivityRepository extends BaseRepository<Activity> {}
