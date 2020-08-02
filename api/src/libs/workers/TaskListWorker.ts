import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { FollowService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { DeleteResult } from 'typeorm/index'
import { TaskListActivities } from '../../database/entities/activities/TaskListActivities'

export class TaskListWorker {
  private static instance: TaskListWorker
  private followService: FollowService

  private constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  static getInstance() {
    if (!TaskListWorker.instance) {
      TaskListWorker.instance = new TaskListWorker()
    }

    return TaskListWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {
    switch (event.action) {
      case TaskListActivities.Deleted:
        await this.unfollowTasks(event)
        break
    }
  }

  async unfollowTasks(event: ActivityEvent): Promise<void | DeleteResult> {
    return this.followService.removeFollowsForTaskBoardList(event)
  }
}