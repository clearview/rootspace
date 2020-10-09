import * as dotenv from 'dotenv'
dotenv.config()
import db from '../db'
import { Job } from 'bull'
import { ActivityType } from '../types/activity'
import { ActivityEvent } from '../services/events/ActivityEvent'
import { DocWorker } from './workers/DocWorker'
import { TaskBoardWorker } from './workers/TaskBoardWorker'
import { TaskListWorker } from './workers/TaskListWorker'
import { TaskWorker } from './workers/TaskWorker'
import { UserWorker } from './workers/UserWorker'
import { InviteWorker } from './workers/InviteWorker'
import { Queue } from './Queue'
import * as ContentActivitiHandlers from '../services/activity/activities/content/handlers'
import { IContentActivityHandler } from '../services/activity/activities/content'

export class Worker {
  static async process() {
    await db()

    await Queue.getActivityInstance().process(Queue.ACTIVITY_QUEUE_NAME, async (job) => {
      await Worker.dispatch(job)
    })
  }

  private static async dispatch(job: Job<any>) {
    const data: any = job.data

    if (data.handler) {
      const handler: IContentActivityHandler = new ContentActivitiHandlers[data.handler](data)
      await handler.process()

      return
    }

    const event: ActivityEvent = data

    switch (event.entity) {
      case ActivityType.User:
      case ActivityType.PasswordReset:
        await UserWorker.getInstance().process(event)
        break
      case ActivityType.Invite:
        await InviteWorker.getInstance().process(event)
        break
      case ActivityType.Doc:
        await DocWorker.getInstance().process(event)
        break
      case ActivityType.TaskBoard:
        await TaskBoardWorker.getInstance().process(event)
        break
      case ActivityType.TaskList:
        await TaskListWorker.getInstance().process(event)
        break
      case ActivityType.Task:
        await TaskWorker.getInstance().process(event)
        break
    }
  }
}
