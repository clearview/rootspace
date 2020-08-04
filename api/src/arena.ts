import 'dotenv/config'
import { config } from 'node-config-ts'
import Arena from 'bull-arena'
import e from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

const redisHost = config.redis.host
const redisPort = config.redis.port

const arenaConfig: e.RequestHandler<ParamsDictionary> = Arena({
  queues: [
    {
      name: 'Activity',
      hostId: 'Root Queue',
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
