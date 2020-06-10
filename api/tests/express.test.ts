import request from 'supertest'
import Server from '../src/server'
import {connect, disconnect} from './helpers/db.testcontainers'
import {createUser} from './fixtures/createUser'
import {UserRepository} from '../src/repositories/UserRepository'
import {getCustomRepository} from 'typeorm'

const server = new Server()

describe('Express', () => {

    beforeAll(async () => {
        await connect()

        const user = await createUser('test@test.com', '123123')
        const userRepository = getCustomRepository(UserRepository)
        await userRepository.save(user)

        await server.bootstrap()
        server.listen(3333)
    })

    afterAll(async () => {
        await server.close()
        await disconnect()
    })

    it('should GET root API', async () => {
        const res = await request(server.app).get('/')

        expect(res.statusCode).toEqual(200)
    })
})
