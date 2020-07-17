require('dotenv').config()

module.exports = {
  name: 'default',
  type: 'postgres',
  url: process.env.POSTGRES,
  logging: false,
  synchronize: false,
  migrationsRun: true,
  seeds: [`${__dirname}/src/database/seeder/seeds/**/*{.ts,.js}`],
  factories: [`${__dirname}/src/database/seeder/factories/**/*{.ts,.js}`],
  entities: [`${__dirname}/src/database/entities/**/*{.ts,.js}`],
  subscribers: [`${__dirname}/src/database/subscribers/**/*{.ts,.js}`],
  migrations: [`${__dirname}/src/database/migrations/**/*{.ts,.js}`],
  cli: {
    entitiesDir: `${__dirname}/src/database/entities`,
    migrationsDir: `${__dirname}/src/database/migrations`,
    subscribersDir: `${__dirname}/src/database/subscribers`
  }
}