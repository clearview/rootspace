import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { Follow } from '../../database/entities/Follow'
import { DeleteResult } from 'typeorm'
import { FollowService, NotificationService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'

export abstract class BaseWorker {
  followService: FollowService
  notificationService: NotificationService

  protected constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
    this.notificationService = NotificationService.getInstance()
  }

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
  abstract async process(event: ActivityEvent): Promise<void>

  async followActivity(event: ActivityEvent): Promise<Follow> {
    return this.followService.followFromActivity(event)
  }

  async unfollowActivity(event: ActivityEvent): Promise<void | DeleteResult> {
    return this.followService.removeFollowsFromActivity(event)
  }

  async notifyFollowers(event: ActivityEvent): Promise<void> {
    const followerUserIds = await this.followService.getFollowerIds(event)

    for (const userId of followerUserIds) {
      const shouldReceiveNotification  = await this.followService.shouldReceiveNotification(userId, event)
      if (!shouldReceiveNotification) { break }

      event.userId = userId

      const notification = await this.notificationService.create(event)
      await this.notificationService.save(notification)
    }
  }
}