import { Activity } from '../../../../database/entities/Activity'
import { ServiceFactory } from '../../../factory/ServiceFactory'
import { FollowService, NotificationService, EntityService } from '../../../'
import { IContentActivityHandler, IContentActivityData } from './types'
import { ActivityService } from '../../ActivityService'

export abstract class ContentActivityHandler<T> implements IContentActivityHandler {
  protected followService: FollowService
  protected notificationService: NotificationService
  protected activityService: ActivityService
  protected entityService: EntityService

  protected data: IContentActivityData
  protected activity: Activity
  protected entity: T

  constructor(data: IContentActivityData) {
    this.followService = ServiceFactory.getInstance().getFollowService()
    this.notificationService = NotificationService.getInstance()
    this.entityService = ServiceFactory.getInstance().getEntityService()
    this.activityService = ServiceFactory.getInstance().getActivityService()

    this.data = data
  }

  protected async init() {
    this.activity = await this.activityService.getById(this.data.activityId)
    this.entity = await this.entityService.getEntityByNameAndId<T>(this.activity.entity, this.activity.entityId, {withDeleted: true})
  }

  abstract async process(): Promise<void>

  /**
   * Note: All processes dependant on `followService.shouldReceiveNotification` for 'back-off' mechanism
   * should be called before creation actual notification using `this.createNotifications()` method
   *
   * Example:
   *   async process(event: ActivityEvent): Promise<void> {
   *      await this.emailFollowers(event)
   *      await this.notifyFollowers(event)
   *   }
   *
   */

  protected async contentCreated(): Promise<void> {
    await this.followService.followEntity(this.activity.actorId, this.entity)
  }

  protected async createNotifications(): Promise<void> {
    const follows = await this.followService.getFollowsForActivity(this.activity)

    for (const follow of follows) {
      const shouldReceiveNotification = await this.followService.shouldReceiveNotification(follow.userId, this.activity)

      if (!shouldReceiveNotification) {
        //continue
      }

      await this.notificationService.create(this.activity, follow.userId)
    }
  }
}
