import * as dotenv from 'dotenv'
dotenv.config()
import { Job } from 'bull'
import { CronEvent } from '../services/events/CronEvent'
import { MarkOverdueTasks } from './cron/MarkOverdueTasks'
import db from '../db'
import { Queue } from './Queue'

export class Cron {
  static async process() {
    await db()

    await Queue.getCronInstance().process( Queue.CRON_QUEUE_NAME, async (job) => {
      await Cron.dispatch(job)
    })
  }

  static async dispatch(job: Job<any>) {
    const event: CronEvent = job.data

    switch (event.className) {
      case MarkOverdueTasks.name:
        await MarkOverdueTasks.run()
        break
    }
  }
}
