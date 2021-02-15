import db from './db'
import { Queue } from './libs/Queue'
import { IActivityHandler } from './services/activity/activities/ActivityHandler'
import * as handlers from './services/activity/activities/handlers'

async function main() {
  await db()

  await Queue.getActivityInstance().process(Queue.ACTIVITY_QUEUE_NAME, async (job) => {
    const data: any = job.data

    if (data.handler) {
      const handler: IActivityHandler = new handlers[data.handler](data)
      await handler.process()
    }
  })
}

main()
