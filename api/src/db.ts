import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()
import { createConnection } from 'typeorm'
import { config } from 'node-config-ts'

export default async function init() {
  return createConnection({
    name: 'default',
    type: 'postgres',
    url: config.postgres,
    logging: false,
    synchronize: false,
    entities: [`${__dirname}/database/entities/**/*{.ts,.js}`],
    subscribers: [`${__dirname}/database/subscribers/**/*{.ts,.js}`],
    migrations: [`${__dirname}/database/migrations/**/*{.ts,.js}`],
    migrationsTableName: 'migrations'
  })
}
