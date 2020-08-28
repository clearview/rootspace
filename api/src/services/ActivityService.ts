import 'dotenv/config'
import Bull from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { getCustomRepository } from 'typeorm'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { Activity } from '../database/entities/Activity'
import { Queue } from '../libs/Queue'
import { WsEventEmitter } from './events/WsEventEmitter'
import { WsEvent } from './events/WsEvent'

export class ActivityService {
  private static instance: ActivityService
  readonly queue: Bull.Queue
  readonly wsEventEmitter: WsEventEmitter

  private constructor() {
    this.queue = Queue.getActivityInstance()
    this.wsEventEmitter = WsEventEmitter.getInstance()
  }

  static getInstance() {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService()
    }

    return ActivityService.instance
  }

  getActivityRepository(): ActivityRepository {
    return getCustomRepository(ActivityRepository)
  }

  async add(event: ActivityEvent): Promise<Bull.Job> {
    const activityObject = event.toObject()

    const activity = await this.getActivityRepository().save(activityObject)
    const entity = await this.getEntityFromActivityEvent(event)
    this.wsEventEmitter.emit(WsEvent.NAME, event)

    return this.queue.add(Queue.QUEUE_NAME, activityObject)
  }

  getActivitiesBySpaceId(spaceId: number): Promise<Activity[]> {
    return this.getActivityRepository().find({ spaceId })
  }

  async getEntityFromActivityEvent(event: ActivityEvent): Promise<any> {
    return this.getActivityRepository().getEntityFromActivityEvent(event)
  }

  async getBySpaceId(spaceId: number, type?: string, action?: string): Promise<Activity[]> {
    return this.getActivityRepository().getBySpaceId(spaceId, type, action)
  }

  async getByEntityTypeAndEntityId(spaceId: number, type: string, id: number, action?: string): Promise<Activity[]> {
    return this.getActivityRepository().getByTypeAndEntityIdId(spaceId, type, id, action)
  }
}
