import * as dotenv from 'dotenv'
dotenv.config()
import { config } from 'node-config-ts'
import Redis from 'ioredis'
import Bull from 'bull'
import { Activity } from '../database/entities/Activity'

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
}
