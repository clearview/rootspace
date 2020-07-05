require('dotenv').config()

module.exports = {
  name: 'default',
  type: 'postgres',
  url: process.env.POSTGRES,
  logging: false,
  synchronize: true,
  seeds: ['src/database/seeder/seeds/**/*{.ts,.js}'],
  factories: ['src/database/seeder/seeds/factories/**/*{.ts,.js}'],
  entities: [`${__dirname}/src/database/entities/**/*{.ts,.js}`],
  subscribers: [`${__dirname}/src/database/subscribers/**/*{.ts,.js}`],
  migrations: [`${__dirname}/src/database/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: `./src/database/migrations`
  }
}