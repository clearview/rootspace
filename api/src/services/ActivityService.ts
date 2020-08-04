import 'dotenv/config'
import { config } from 'node-config-ts'
import Bull, { Queue } from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { getCustomRepository } from 'typeorm/index'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { Activity } from '../database/entities/Activity'

const QUEUE_NAME = 'Activity'
const redisHost = config.redis.host
const redisPort = config.redis.port

export class ActivityService {
  private redisConfig = { host: redisHost, port: redisPort }
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


  getActivityRepository(): ActivityRepository {
    return getCustomRepository(ActivityRepository)
  }

  async add(activityEvent: ActivityEvent): Promise<Bull.Job> {
    return this.queue.add(QUEUE_NAME, activityEvent.toObject())
  }

  getActivitiesBySpaceId(spaceId: number): Promise<Activity[]> {
    return this.getActivityRepository().find({ spaceId })
  }

  async getEntityFromActivity(event: ActivityEvent): Promise<any> {
    return this.getActivityRepository().getEntityFromActivityEvent(event)
  }
}
