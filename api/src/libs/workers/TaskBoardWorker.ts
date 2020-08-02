import 'dotenv/config'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { FollowService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { DeleteResult } from 'typeorm/index'
import { TaskBoardActivities } from '../../database/entities/activities/TaskBoardActivities'

export class TaskBoardWorker {
  private static instance: TaskBoardWorker
  private followService: FollowService

  private constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
  }

  static getInstance() {
    if (!TaskBoardWorker.instance) {
      TaskBoardWorker.instance = new TaskBoardWorker()
    }

    return TaskBoardWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {
    switch (event.action) {
      case TaskBoardActivities.Deleted:
        await this.unfollowTasks(event)
        break
    }
  }

  async unfollowTasks(event: ActivityEvent): Promise<void | DeleteResult> {
    return this.followService.removeFollowsForTaskBoard(event)
  }
}