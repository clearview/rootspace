import request from 'supertest'
import Server from '../../src/server'
import { connect, disconnect } from '../connectors/db.testcontainers'
import { createUser } from '../helpers/createUser'
import { getJwt } from '../helpers/getJwt'
import { createSpace } from '../helpers/createSpace'
import { TaskBoardType } from '../../src/database/entities/tasks/TaskBoard'

const server = new Server()
const mockUser: any = {}

describe('Taskboard', () => {

    beforeAll(async () => {
        await connect(true)

        const user = await createUser('betty@boop.com', '123123')
        const space = await createSpace(user, 'Area 51')

        await server.bootstrap()
        server.listen(3334)

        mockUser.userId = user.id
        mockUser.spaceId = space.id
        mockUser.jwt = await getJwt(server.app, user.email, '123123')
    })

    afterAll(async () => {
        await server.close()
        await disconnect()
    })

    it('should fail for unauthorized user', async () => {
        const res = await request(server.app).post('/tasks/board')

        expect(res.statusCode).toEqual(401)
    })

    it('should create a task board', async () => {
        const taskBoardTitle = 'Awesome Task Board'
        const res = await request(server.app)
            .post('/tasks/board')
            .set('Authorization', `Bearer ${mockUser.jwt}`)
            .send({
                data: {
                    spaceId: mockUser.spaceId,
                    type: TaskBoardType.Kanban,
                    title: taskBoardTitle
                }
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.title).toEqual(taskBoardTitle)
    })

})
