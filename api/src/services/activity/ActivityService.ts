import 'dotenv/config'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { getCustomRepository } from 'typeorm'
import { ActivityRepository } from '../../database/repositories/ActivityRepository'
import { Activity } from '../../database/entities/Activity'
import { Queue } from '../../libs/Queue'
import { WsEventEmitter } from '../events/websockets/WsEventEmitter'
import { WsEvent } from '../events/websockets/WsEvent'
import { AggregatedActivity } from './types'
import { AggregateProcessor } from './AggregateProcessor'

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

    await this.getActivityRepository().save(activityObject)
    this.wsEventEmitter.emit(WsEvent.NAME, event)

    return this.queue.add(Queue.ACTIVITY_QUEUE_NAME, activityObject)
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

  async getAggregatedForEntity(spaceId: number, entity: string, entityId: number): Promise<AggregatedActivity[]> {
    const activities = await this.getByEntityTypeAndEntityId(spaceId, entity, entityId)
    return new AggregateProcessor(activities, entity).aggregate()
  }
}
