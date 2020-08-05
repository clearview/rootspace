import 'dotenv/config'
import Bull from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { getCustomRepository } from 'typeorm/index'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { Activity } from '../database/entities/Activity'
import { Queue } from '../libs/Queue'

export class ActivityService {
  readonly queue: Bull.Queue

  private constructor() {
    this.queue = Queue.getActivityInstance()
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
    return this.queue.add(Queue.QUEUE_NAME, activityEvent.toObject())
  }

  getActivitiesBySpaceId(spaceId: number): Promise<Activity[]> {
    return this.getActivityRepository().find({ spaceId })
  }

  async getEntityFromActivity(event: ActivityEvent): Promise<any> {
    return this.getActivityRepository().getEntityFromActivityEvent(event)
  }
}
