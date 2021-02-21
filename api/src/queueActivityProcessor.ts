import db from './db'
import { Queue } from './libs/Queue'
import { IActivityHandler } from './services/activity/activities/ActivityHandler'
import { IActivityObject } from './services/activity/activities/ActivityObject'
import * as handlers from './services/activity/activities/handlers'

async function main() {
  await db()

  await Queue.getActivityInstance().process(Queue.ACTIVITY_QUEUE_NAME, async (job) => {
    const activityObject: IActivityObject = job.data

    if (activityObject.handler) {
      const handler: IActivityHandler = new handlers[activityObject.handler](activityObject.data)
      await handler.process()
    }
  })
}

main()
