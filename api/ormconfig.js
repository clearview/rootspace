require('dotenv').config()

module.exports = {
  name: 'default',
  type: 'postgres',
  url: process.env.POSTGRES,
  logging: false,
  synchronize: true,
  entities: [`${__dirname}/src/entities/*{.ts,.js}`],
  migrations: [`${__dirname}/src/migrations/*{.ts,.js}`],
  subscribers: [`${__dirname}/src/subscriber/*{.ts,.js}`]
}