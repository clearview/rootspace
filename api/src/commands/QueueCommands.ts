import 'dotenv/config'
import chalk from 'chalk'
import db from '../db'
import { config } from 'node-config-ts'
import Bull, { Queue } from 'bull'
import { getCustomRepository } from 'typeorm'
import { ActivityRepository } from '../database/repositories/ActivityRepository'

const QUEUE_NAME = 'Activity'

export class QueueCommands {
  private redisConfig = { host: config.redis.host, port: config.redis.port }
  private queue: Queue

  constructor() {
    this.queue = new Bull(QUEUE_NAME, { redis: this.redisConfig })
  }

  async run(command: string) {
    if (config.env !== 'test') {
      await db()
    }

    try {
      switch (command) {
        case 'start':
          await this.start()
          break
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Queue operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    }
  }

  private async start(queueName: string = QUEUE_NAME) {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow(`Processing "${queueName}" queue...`))

    await this.queue.process(queueName, async (job) => {
      return getCustomRepository(ActivityRepository).save(job.data)
    })
  }
}
