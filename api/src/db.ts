import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { config } from 'node-config-ts'

export default async function init() {
  const connection = await createConnection({
    name: 'default',
    type: 'postgres',
    url: config.postgres,
    logging: false,
    synchronize: true,
    entities: [`${__dirname}/entities/*{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    subscribers: [`${__dirname}/entities/subscribers/*{.ts,.js}`]
  })

  return connection
}
