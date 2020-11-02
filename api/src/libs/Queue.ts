import * as dotenv from 'dotenv'
dotenv.config()
import { config } from 'node-config-ts'
import Redis from 'ioredis'
import Bull from 'bull'

const redisHost = config.redis.host
const redisPort = config.redis.port

const client: Redis.Redis = new Redis(redisPort, redisHost)
const subscriber: Redis.Redis = new Redis(redisPort, redisHost)

const redisOpts = {
  createClient(type: string) {
    switch (type) {
      case 'client':
        return client
      case 'subscriber':
        return subscriber
      default:
        return new Redis(redisPort, redisHost)
    }
  },
}

export class Queue {
  static ACTIVITY_QUEUE_NAME = 'Activity'
  static CRON_QUEUE_NAME = 'Cron'

  // @ts-ignore
  static options: Bull.QueueOptions = {
    ...redisOpts,
    limiter: {
      max: 16,
      duration: 1000,
    },
    defaultJobOptions: {
      removeOnComplete: false,
    },
  }

  static getActivityInstance(): Bull.Queue {
    return new Bull(Queue.ACTIVITY_QUEUE_NAME, Queue.options)
  }

  static getCronInstance(): Bull.Queue {
    return new Bull(Queue.CRON_QUEUE_NAME, Queue.options)
  }
}
