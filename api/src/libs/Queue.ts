import * as dotenv from 'dotenv'
dotenv.config()
import { config } from 'node-config-ts'
import db from '../db'
import Redis from 'ioredis'
import Bull, { Job } from 'bull'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import { getCustomRepository } from 'typeorm'
import { Activity } from '../database/entities/Activity'
import { ActivityEvent, EntityType } from '../services/events/ActivityEvent'
import { DocWorker } from './workers/DocWorker'
import { TaskBoardWorker } from './workers/TaskBoardWorker'
import { TaskListWorker } from './workers/TaskListWorker'
import { TaskWorker } from './workers/TaskWorker'
import { UserWorker } from './workers/UserWorker'
import { InviteWorker } from './workers/InviteWorker'

const redisHost = config.redis.host
const redisPort = config.redis.port

const client: Redis.Redis = new Redis(redisPort, redisHost)
const subscriber: Redis.Redis = new Redis(redisPort, redisHost)

const redisOpts = {
  createClient (type: string) {
    switch(type) {
      case 'client':
        return client
      case 'subscriber':
        return subscriber
      default:
        return new Redis(redisPort, redisHost)
    }
  }
}

export class Queue {
  static QUEUE_NAME = 'Activity'

  static getActivityInstance(): Bull.Queue {
    // @ts-ignore
    const options: Bull.QueueOptions = {
      ...redisOpts,
      limiter: {
        max: 16,
        duration: 1000
      },
      defaultJobOptions: {
        removeOnComplete: false
      }
    }

    return new Bull(Queue.QUEUE_NAME, options)
  }

  static async process(queueName: string = Queue.QUEUE_NAME) {
    await db()

    await Queue.getActivityInstance().process(queueName, async (job) => {
      job.data.activity = await Queue.saveActivity(job)

      await Queue.dispatchToWorker(job)
    })
  }

  private static saveActivity(job: Job<any>): Promise<Activity> {
    return getCustomRepository(ActivityRepository).save(job.data)
  }

  private static async dispatchToWorker(job: Job<any>) {
    const event: ActivityEvent = job.data

    switch (event.entity) {
      case EntityType.User:
        await UserWorker.getInstance().process(event)
        break
      case EntityType.Invite:
        await InviteWorker.getInstance().process(event)
        break
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
