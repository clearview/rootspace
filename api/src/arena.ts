import 'dotenv/config'
import { config } from 'node-config-ts'
import Arena from 'bull-arena'
import e from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Queue } from './libs/Queue'

const redisHost = config.redis.host
const redisPort = config.redis.port

const arenaConfig: e.RequestHandler<ParamsDictionary> = Arena({
  queues: [
    {
      name: Queue.ACTIVITY_QUEUE_NAME,
      hostId: 'Root Queue',
      type: 'bull',
      redis: {
        host: redisHost,
        port: redisPort
      }
    },
    {
      name: Queue.CRON_QUEUE_NAME,
      hostId: 'Cron Queue',
      type: 'bull',
      redis: {
        host: redisHost,
        port: redisPort
      }
    }
  ]
},
{
  disableListen: true
})

export default arenaConfig
