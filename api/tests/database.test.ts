import {connect, disconnect} from './connectors/db.testcontainers'
import {getCustomRepository} from 'typeorm'
import {TaskBoard, TaskBoardType} from '../src/database/entities/tasks/TaskBoard'
import {TaskBoardRepository} from '../src/repositories/tasks/TaskBoardRepository'
import {validate} from 'class-validator'

describe('Database', () => {
    beforeAll(async () => {
        await connect( true)
    })

    afterAll(async () => {
        await disconnect()
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