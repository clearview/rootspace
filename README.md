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

#### API Testing

##### Writing tests
Use `docker-compose up -d` in api/tests directory to bring up test postgres database and use `helpers/db.docker.ts` connector while working on a test.

This will make running a test much faster when writing / executing test and enable you to connect to test database through port 5433 so you can inspect test db contents.

##### TestContainers

Once satisfied with your tests switch to `helpers/db.testcontatiners.ts` to utilize TestContainers in your test.

This will spawn a fresh postgres db container for every test so `root_postgres_test` is not needed anymore.

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

Note: You can also run `docker-compose up` or `docker-compose up -d` from `tests` directory to bring up ephemeral testing postgres database

```
- visit web on your machine's port 80 or port 3000
- access api through port 3001
- connect from your machine to postgresql on port 5432
- watch container logs in realtime on port 9999
- access sent emails on port 8025
- run container-related commands with docker/cli.sh script
```

# Infra related

* http://consul.root.prod.clearviewdev.io:8080/
* http://nomad.root.prod.clearviewdev.io:8080/

## Credentials for Nomad and Consul

````
username: nomad
password: 67ce7dd7dAa28f4835915d3c7fbfA27a4a8c83c1380f157453b469de01813c228_2020
````
