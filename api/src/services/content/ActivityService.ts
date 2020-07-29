import Bull, { Queue } from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { ActivityRepository } from '../../database/repositories/ActivityRepository'
import { getCustomRepository } from 'typeorm'

const QUEUE_NAME = 'Activity'

export class ActivityService {
  private redisConfig = { host: 'redis', port: 6379 }
  private queue: Queue

  private constructor() {
    this.queue = new Bull(QUEUE_NAME, { redis: this.redisConfig })

    this.queue.process(QUEUE_NAME, async (job) => {
      return getCustomRepository(ActivityRepository).save(job.data)
    })
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
}
