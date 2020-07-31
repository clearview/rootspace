import Bull, { Queue } from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { getCustomRepository } from 'typeorm/index'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { Activity } from '../database/entities/Activity'

const QUEUE_NAME = 'Activity'

export class ActivityService {
  private redisConfig = { host: 'redis', port: 6379 }
  readonly queue: Queue

  private constructor() {
    this.queue = new Bull(QUEUE_NAME, { redis: this.redisConfig })
  }

  private static instance: ActivityService

  static getInstance() {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService()
    }

    return ActivityService.instance
  }

  async add(activityEvent: ActivityEvent): Promise<Bull.Job> {
    return this.queue.add(QUEUE_NAME, activityEvent.toObject())
  }

  getActivityRepository(): ActivityRepository {
    return getCustomRepository(ActivityRepository)
  }

  getActivitiesBySpaceId(spaceId: number): Promise<Activity[]> {
    return this.getActivityRepository().find({ spaceId })
  }

}
