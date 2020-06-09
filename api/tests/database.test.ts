import {Connection, getConnection, getConnectionManager, getCustomRepository} from 'typeorm'
import {TaskBoard, TaskBoardType} from '../src/entities/TaskBoard'
import {TaskBoardRepository} from '../src/repositories/TaskBoardRepository'
import {validate} from 'class-validator'
import {GenericContainer, StartedTestContainer} from 'testcontainers'

let container: StartedTestContainer = null
let connection: Connection

describe('Database', () => {
    beforeAll(async () => {
        container = await new GenericContainer('postgres', '12')
            .withName('root_test')
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
    })

    afterAll(async () => {
        await getConnection().close()
        await container.stop()
    })

    it('should save and retrieve a record', async () => {
        const taskBoard = createTaskBoard()
        const taskBoardRepository = getCustomRepository(TaskBoardRepository)

        const savedTaskBoard = await taskBoardRepository.save(taskBoard)
        expect(savedTaskBoard.title).toBe('Timber')
        expect(savedTaskBoard.type).toBe(TaskBoardType.Kanban)

        const loadedTaskBoard = await taskBoardRepository.findOne({ title: 'Timber' })
        expect(loadedTaskBoard.title).toBe('Timber')
        expect(loadedTaskBoard.type).toBe(TaskBoardType.Kanban)
    })

    it('should fail with constraint error', async () => {
        const taskBoard = createTaskBoard()
        delete taskBoard.title

        const taskBoardRepository = getCustomRepository(TaskBoardRepository)

        await expect(taskBoardRepository.save(taskBoard))
            .rejects
            .toMatchObject({
                name: 'QueryFailedError',
                message: 'null value in column "title" violates not-null constraint'
            })
    })

    it('should fail with validation error', async () => {
        const taskBoard = createTaskBoard()
        taskBoard.title = '?'

        await expect(validate(taskBoard))
            .resolves
            .toMatchObject(
                expect.arrayContaining([
                    expect.objectContaining({
                        constraints: {
                            length: 'title must be longer than or equal to 2 characters'
                        }
                    })
                ])
            )
    })

    function createTaskBoard(): TaskBoard {
        const taskBoard = new TaskBoard()
        taskBoard.userId = 1
        taskBoard.spaceId = 1
        taskBoard.title = 'Timber'
        taskBoard.type = TaskBoardType.Kanban

        return taskBoard
    }
})