import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
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
}
