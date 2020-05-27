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

### Docker development environment

- Copy `.env.example` file to `.env` in / folder
- Copy `.env.example` file to `.env` in /api folder
- Copy `.env.example` file to `.env` in /web folder
- Make sure to run `yarn install` in both /api and /web folders
- Run `docker-compose up` or `docker-compose up -d` from project root

```
- visit web on your machine's port 80 or port 3000
- access api through port 3001
- connect from your machine to postgresql on port 5432
- watch container logs in realtime on port 9999
```