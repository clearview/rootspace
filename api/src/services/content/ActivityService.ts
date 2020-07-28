import Bull, { Queue } from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'

const QUEUE_NAME = 'Activities'

export class ActivityService {
  private queue: Queue

  private constructor() {
    this.queue = new Bull(QUEUE_NAME, 'redis://redis:6379')
  }

  private static instance: ActivityService

  static getInstance() {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService()
    }

    return ActivityService.instance
  }

  async register(activityEvent: ActivityEvent): Promise<Bull.Job> {
    return this.queue.add(
      `${activityEvent.entityTargetName} | ${activityEvent.action}`,
      activityEvent.toObject()
    )
  }

}
