import {Connection, getConnection, getConnectionManager} from 'typeorm'
import {GenericContainer, StartedTestContainer} from 'testcontainers'

let container: StartedTestContainer = null
let connection: Connection

async function spawnTestDatabase () {
    container = await new GenericContainer('postgres', '12')
        .withName('root_test_database')
        .withEnv('POSTGRES_USER', 'test')
        .withEnv('POSTGRES_PASSWORD', 'test')
        .withEnv('POSTGRES_DB', 'test')
        .withExposedPorts(5432)
        .start()

    const connectionManager = getConnectionManager()

    connection = connectionManager.create({
        name: 'default',
        type: 'postgres',
        url: `postgresql://test:test@${container.getContainerIpAddress()}:${container.getMappedPort(5432)}/test`,
        logging: false,
        synchronize: true,
        migrations: [`${__dirname}/../src/migrations/*{.ts,.js}`],
        entities: [`${__dirname}/../src/entities/*{.ts,.js}`],
        subscribers: [`${__dirname}/../src/entities/subscribers/*{.ts,.js}`]
    })

    await connection.connect()
}

async function destroyTestDatabase() {
    await getConnection().close()
    await container.stop()
}

export {spawnTestDatabase, destroyTestDatabase}