import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { DocActivities } from '../../database/entities/activities/DocActivities'
import { Follow } from '../../database/entities/Follow'
import { DeleteResult } from 'typeorm/index'
import { FollowService, NotificationService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'

export class DocWorker {
  private static instance: DocWorker
  private followService: FollowService
  private notificationService: NotificationService

  private constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
    this.notificationService = NotificationService.getInstance()
  }

  static getInstance() {
    if (!DocWorker.instance) {
      DocWorker.instance = new DocWorker()
    }

    return DocWorker.instance
  }

  /**
   * Note: All processes dependant on `followService.shouldReceiveNotification` for 'back-off'
   * should be called before creation actual notification
   */
  async process(event: ActivityEvent): Promise<void> {
    await this.notifyFollowers(event)

    switch (event.action) {
      case DocActivities.Created:
        await this.followActivity(event)
        break
      case DocActivities.Deleted:
        await this.unfollowActivity(event)
        break
    }
  }

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