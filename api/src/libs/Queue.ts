import 'dotenv/config'
import { config } from 'node-config-ts'
import db from '../db'
import Bull, { Job } from 'bull'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { getCustomRepository } from 'typeorm'
import { Activity } from '../database/entities/Activity'
import { ActivityEvent, EntityType } from '../services/events/ActivityEvent'
import { DocWorker } from './workers/DocWorker'
import { TaskBoardWorker } from './workers/TaskBoardWorker'
import { TaskListWorker } from './workers/TaskListWorker'
import { TaskWorker } from './workers/TaskWorker'

const QUEUE_NAME = 'Activity'

export class Queue {
  private redisConfig = { host: config.redis.host, port: config.redis.port }
  private queue: Bull.Queue

  private constructor() {
    this.queue = new Bull(QUEUE_NAME, { redis: this.redisConfig })
  }

  static async process(queueName: string = QUEUE_NAME) {
    await db()

    await new Queue().queue.process(queueName, async (job) => {
      await Queue.saveActivity(job)
      await Queue.dispatchToWorker(job)
    })
  }

  private static saveActivity(job: Job<any>): Promise<Activity> {
    return getCustomRepository(ActivityRepository).save(job.data)
  }

  private static async dispatchToWorker(job: Job<any>) {
    const event: ActivityEvent = job.data

    switch (event.entity) {
      case EntityType.Doc:
        await DocWorker.getInstance().process(event)
        break
      case EntityType.TaskBoard:
        await TaskBoardWorker.getInstance().process(event)
        break
      case EntityType.TaskList:
        await TaskListWorker.getInstance().process(event)
        break
      case EntityType.Task:
        await TaskWorker.getInstance().process(event)
        break
    }
  }
}
