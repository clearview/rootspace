import 'dotenv/config'
import Bull from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { getCustomRepository } from 'typeorm/index'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { Activity } from '../database/entities/Activity'
import { Queue } from '../libs/Queue'
import { WsService } from './content/WsService'

export class ActivityService {
  readonly queue: Bull.Queue
  private wsService: WsService

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
    const activityObject = activityEvent.toObject()

    await this.getActivityRepository().save(activityObject)
    await this.broadcastWebsocketMessage(activityEvent)

    return this.queue.add(Queue.QUEUE_NAME, activityObject)
  }

  private async broadcastWebsocketMessage(event: ActivityEvent): Promise<void> {
    this.wsService = WsService.fromServer()
    await this.wsService.broadcast(event)
  }

  getActivitiesBySpaceId(spaceId: number): Promise<Activity[]> {
    return this.getActivityRepository().find({ spaceId })
  }

  async getEntityFromActivity(event: ActivityEvent): Promise<any> {
    return this.getActivityRepository().getEntityFromActivityEvent(event)
  }

  async getBySpaceId(spaceId: number, type?: string, action?: string): Promise<Activity[]> {
    return this.getActivityRepository().getBySpaceId(spaceId, type, action)
  }

  async getByEntityTypeAndEntityId(spaceId: number, type: string, id: number, action?: string): Promise<Activity[]> {
    return this.getActivityRepository().getByTypeAndEntityIdId(spaceId, type, id, action)
  }
}
