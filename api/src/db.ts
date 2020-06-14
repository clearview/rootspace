import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { config } from 'node-config-ts'

export default async function init() {
  return createConnection({
    name: 'default',
    type: 'postgres',
    url: config.postgres,
    logging: false,
    synchronize: true,
    migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    entities: [`${__dirname}/entities/**/*{.ts,.js}`],
    subscribers: [`${__dirname}/subscribers/**/*{.ts,.js}`]
  })
}
