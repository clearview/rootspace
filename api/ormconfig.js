require('dotenv').config()

module.exports = {
  name: 'default',
  type: 'postgres',
  url: process.env.POSTGRES,
  logging: false,
  synchronize: true,
  migrations: [`${__dirname}/src/migrations/*{.ts,.js}`],
  entities: [`${__dirname}/src/entities/*{.ts,.js}`],
  subscribers: [`${__dirname}/src/entities/subscribers/*{.ts,.js}`]
}