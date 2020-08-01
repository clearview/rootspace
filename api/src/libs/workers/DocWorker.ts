import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { DocActivities } from '../../database/entities/activities/DocActivities'
import { FollowService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { Follow } from '../../database/entities/Follow'
import { Notification } from '../../database/entities/Notification'
import { DeleteResult } from 'typeorm/index'

export class DocWorker {
  private static instance: DocWorker
  private followService: FollowService

  private constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  static getInstance() {
    if (!DocWorker.instance) {
      DocWorker.instance = new DocWorker()
    }

    return DocWorker.instance
  }

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

  async notifyFollowers(event: ActivityEvent): Promise<Notification[]> {
    return this.followService.createNotifications(event)
  }
}