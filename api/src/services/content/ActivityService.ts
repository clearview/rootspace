import Bull, { Queue } from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { TaskProcessor } from './processors/TaskProcessor'

const QUEUE_NAME = 'Activities'

export class ActivityService {
  private redisConfig = { host: 'redis', port: 6379 }
  private queue: Queue

  private constructor() {
    this.queue = new Bull(QUEUE_NAME, { redis: this.redisConfig })

    this.addProcessors()
  }

  private static instance: ActivityService

  static getInstance() {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService()
    }

    return ActivityService.instance
  }

  async add(activityEvent: ActivityEvent): Promise<Bull.Job> {
    return this.queue.add(
      activityEvent.targetName, // Match Queue name ('Doc', 'Task', etc.)
      activityEvent.toObject()
    )
  }

  private addProcessors(): void {
    this.queue.process('Task', async (job) => {
      return TaskProcessor.process(job)
    })
  }
}
