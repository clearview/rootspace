import 'dotenv/config'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { getCustomRepository } from 'typeorm'
import { ActivityRepository } from '../../database/repositories/ActivityRepository'
import { Activity } from '../../database/entities/Activity'
import { Queue } from '../../libs/Queue'
import { WsEventEmitter } from '../events/websockets/WsEventEmitter'
import { WsEvent } from '../events/websockets/WsEvent'
import { ActivityAggregator } from './aggregator/ActivityAggregator'
import { IAppActivity } from './activities/types'
import { IActivityObserver } from '../contracts'

export class ActivityService implements IActivityObserver {
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

  async activityNotification(appActivity: IAppActivity): Promise<void> {
    const data = appActivity.toObject()
    const activity = await this.getActivityRepository().save(data as any)

    data.activityId = activity.id

    await this.queue.add(Queue.ACTIVITY_QUEUE_NAME, data)
  }

  async add(event: ActivityEvent): Promise<Bull.Job> {
    const activityObject = event.toObject()

    await this.getActivityRepository().save(activityObject)
    this.wsEventEmitter.emit(WsEvent.NAME, event)

    return this.queue.add(Queue.ACTIVITY_QUEUE_NAME, activityObject)
  }

  getById(id: number): Promise<Activity | undefined> {
    return this.getActivityRepository().findOne(id)
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

  async getByActorId(actorId: number, filter: any = {}): Promise<Activity[]> {
    const activities = await this.getActivityRepository().getByActorId(actorId, filter)
    return new ActivityAggregator().aggregate(activities)
  }

  async getByEntity(entity: string, entityId: number): Promise<Activity[]> {
    const activities = await this.getActivityRepository().getByEntity(entity, entityId)
    return new ActivityAggregator().aggregate(activities)
  }
}
