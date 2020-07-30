import 'dotenv/config'
import { config } from 'node-config-ts'
import Bull from 'bull'
import { ActivityRepository } from '../database/repositories/ActivityRepository'
import db from '../db'
import { getCustomRepository } from 'typeorm'

const QUEUE_NAME = 'Activity'

export class Queue {
  private redisConfig = { host: config.redis.host, port: config.redis.port }
  private queue: Bull.Queue

  constructor() {
    this.queue = new Bull(QUEUE_NAME, { redis: this.redisConfig })
  }

  static async process(queueName: string = QUEUE_NAME) {
    await db()

    await new Queue().queue.process(queueName, async (job) => {
      return getCustomRepository(ActivityRepository).save(job.data)
    })
  }
}
