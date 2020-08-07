import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { FollowService } from '../../services'
import { TaskActivities } from '../../database/entities/activities/TaskActivities'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { Follow } from '../../database/entities/Follow'
import { Notification } from '../../database/entities/Notification'
import { DeleteResult } from 'typeorm/index'

export class TaskWorker {
  private static instance: TaskWorker
  private followService: FollowService

  private constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  static getInstance() {
    if (!TaskWorker.instance) {
      TaskWorker.instance = new TaskWorker()
    }

    return TaskWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {
    await this.notifyFollowers(event)

    switch (event.action) {
      case TaskActivities.Created:
        await this.followActivity(event)
        break
      case TaskActivities.Deleted:
        await this.unfollowActivity(event)
        break
      case TaskActivities.Assignee_Added:
        await this.followActivity(event)
        break
      case TaskActivities.Assignee_Removed:
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