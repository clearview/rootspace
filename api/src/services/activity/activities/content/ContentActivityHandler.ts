import { Follow } from '../../../../database/entities/Follow'
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

  protected constructor(data: IContentActivityData) {
    this.followService = ServiceFactory.getInstance().getFollowService()
    this.notificationService = NotificationService.getInstance()
    this.entityService = ServiceFactory.getInstance().getEntityService()
    this.activityService = ServiceFactory.getInstance().getActivityService()

    this.data = data
  }

  protected async init() {
    this.activity = await this.activityService.getById(this.data.activityId)
    this.entity = await this.entityService.getEntityByNameAndId<T>(this.data.entity, this.data.entityId)
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

  protected async followActivity(userId?: number): Promise<Follow> {
    return this.followService.followFromRequest(userId ?? this.activity.actorId, this.entity)
  }

  protected async unfollowActivity(): Promise<void> {
    this.followService.removeFollowsFromActivity(this.activity)
  }

  protected async notifyFollowers(): Promise<void> {
    const followerUserIds = await this.followService.getFollowerIds(this.activity)

    for (const userId of followerUserIds) {
      const shouldReceiveNotification = await this.followService.shouldReceiveNotification(userId, this.activity)

      if (!shouldReceiveNotification) {
        //continue
      }

      const n = await this.notificationService.create(this.activity, userId)
      console.log(n)
    }
  }
}
