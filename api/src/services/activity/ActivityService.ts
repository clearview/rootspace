import 'dotenv/config'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { getCustomRepository } from 'typeorm'
import { ActivityRepository } from '../../database/repositories/ActivityRepository'
import { Activity } from '../../database/entities/Activity'
import { Queue } from '../../libs/Queue'
import { WsEventEmitter } from '../events/websockets/WsEventEmitter'
import { processActivities } from './processor/'
import { IActivityObserver } from '../contracts'
import { IActivity } from './activities/Activity'

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

  async activityNotification(appActivity: IActivity): Promise<void> {
    const data = appActivity.toObject()
    const activity = await this.getActivityRepository().save(data as any)

    data.activityId = activity.id

    if (data.handler) {
      await this.queue.add(Queue.ACTIVITY_QUEUE_NAME, data)
    }
  }

  getById(id: number): Promise<Activity | undefined> {
    return this.getActivityRepository().findOne(id)
  }

  async getEntityFromActivityEvent(event: ActivityEvent): Promise<any> {
    return this.getActivityRepository().getEntityFromActivityEvent(event)
  }

  async getBySpaceId(spaceId: number, filter: any = {}, options: any = {}): Promise<Activity[]> {
    const activities = await this.getActivityRepository().getBySpaceId(spaceId, filter, options)
    return processActivities(activities)
  }

  async getByEntity(entity: string, entityId: number, options: any = {}): Promise<Activity[]> {
    const activities = await this.getActivityRepository().getByEntity(entity, entityId, options)
    return processActivities(activities)
  }

  async getByActorId(actorId: number, filter: any = {}): Promise<Activity[]> {
    const activities = await this.getActivityRepository().getByActorId(actorId, filter)
    return processActivities(activities)
  }

  async getUserNotify(userId: number, spaceId: number, filter: any = {}, options: any = {}): Promise<Activity[]> {
    const activities = await this.getActivityRepository().getUserNotify(userId, spaceId, filter, options)
    return processActivities(activities)
  }
}
