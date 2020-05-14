# Root app

### How to run

#### Requirements
- node v.12
- TypeScript v.3.8.x
- PostgreSQL 12.x

#### API
- `cd ./api`
- `yarn`
- `yarn global add nodemon`
- create `.env` file from `.env.example`
- `nodemon`

### DB Seeding
DB Seeder will populate following models: User, Space and Link

- Run `cd ./api & yarn seed:run`

#### API docs

https://documenter.getpostman.com/view/152732/Szf27X36?version=latest

#### Debug
- Set `logging: true` in `db.ts` to see in console all SQL queries sent to PostgreSQL server