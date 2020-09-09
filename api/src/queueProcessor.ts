import { Worker } from './libs/Worker'
import Bull from 'bull'
import { Queue } from './libs/Queue'
import { CronEvent } from './services/events/CronEvent'
import { MarkOverdueTasks } from './libs/cron/MarkOverdueTasks'
import { Cron } from './libs/Cron'

async function main() {
  await addRepeatableTasks()

  /**
   * Spawn another process for cron processor ?
   */
  // await Cron.process()
  await Worker.process()
}

async function addRepeatableTasks(): Promise<Bull.Job> {
  const queue = Queue.getCronInstance()

  const taskOverdue = CronEvent
    .forClass(MarkOverdueTasks.name)

  const repeatableOptions = {
    repeat: {
      // cron: '0 0 * * *'
      every: 10000,
      limit: 100
    }
  }

  return queue.add(
    Queue.CRON_QUEUE_NAME,
    taskOverdue,
    repeatableOptions
  )
}

main()
