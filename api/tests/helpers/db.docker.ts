import {Connection, getConnection, getConnectionManager} from 'typeorm'

let connection: Connection

const connect = async (dropDatabase?: boolean): Promise<Connection> => {
    const connectionManager = getConnectionManager()

    connection = connectionManager.create({
        name: 'default',
        type: 'postgres',
        url: 'postgresql://test:test@localhost:5433/test',
        logging: false,
        synchronize: true,
        migrations: [`${__dirname}/../../src/migrations/*{.ts,.js}`],
        entities: [`${__dirname}/../../src/entities/*{.ts,.js}`],
        subscribers: [`${__dirname}/../../src/entities/subscribers/*{.ts,.js}`]
    })

    await connection.connect()

    if (dropDatabase) {
        await connection.synchronize(true)
    }

    return connection
}

const disconnect = async () => {
    await getConnection().close()
}

export {connect, disconnect}