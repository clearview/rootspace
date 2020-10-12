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

  protected constructor(data: IContentActivityData) {
    this.followService = ServiceFactory.getInstance().getFollowService()
    this.notificationService = NotificationService.getInstance()
    this.entityService = ServiceFactory.getInstance().getEntityService()
    this.activityService = ServiceFactory.getInstance().getActivityService()

    this.data = data
  }

  protected async init() {
    this.activity = await this.activityService.getById(this.data.activityId)
  }

  abstract async process(): Promise<void>

  /**
   * Note: All processes dependant on `followService.shouldReceiveNotification` for 'back-off' mechanism
   * should be called before creation actual notification using `this.notifyFollowers()` method
   *
   * Example:
   *   async process(event: ActivityEvent): Promise<void> {
   *      await this.emailFollowers(event)
   *      await this.notifyFollowers(event)
   *   }
   *
   */

  protected async contentCreated(): Promise<void> {
    await this.followService.followEntity(this.activity.actorId, this.activity.entity, this.activity.entityId)
  }

  protected async contentDeleted(): Promise<void> {
    await this.followService.removeFollowsForEntity(this.activity.entity, this.activity.entityId)
  }

  protected async notifyFollowers(): Promise<void> {
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
