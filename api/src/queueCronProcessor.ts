import * as dotenv from 'dotenv'
dotenv.config()
import { config } from 'node-config-ts'
import Bull from 'bull'
import { Queue } from './libs/Queue'
import { CronEvent } from './events/CronEvent'
import { Cron } from './libs/Cron'

async function main() {
  await addRepeatableTasks()
  await Cron.process()
}

async function addRepeatableTasks(): Promise<Bull.Job> {
  const className = config.cron.markOverdueTask.className
  const repeatableOptions = config.cron.markOverdueTask.repeatableOptions

  const queue = Queue.getCronInstance()

  const taskOverdue = CronEvent
    .forClass(className)
    .toObject()

  return queue.add(
    Queue.CRON_QUEUE_NAME,
    taskOverdue,
    repeatableOptions
  )
}

main()
