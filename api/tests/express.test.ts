import request from 'supertest'
import Server from '../src/server'
import {connect, disconnect} from './helpers/db.testcontainers'
import {createUser} from './fixtures/createUser'
import {UserRepository} from '../src/repositories/UserRepository'
import {getCustomRepository} from 'typeorm'

const server = new Server()

describe('Express', () => {

    beforeAll(async () => {
        await connect(true)

        const user = await createUser('betty@boop.com', '123123')
        const userRepository = getCustomRepository(UserRepository)
        await userRepository.save(user)

        await server.bootstrap()
        server.listen(3333)
    })

    afterAll(async () => {
        await server.close()
        await disconnect()
    })

    it('should GET root', async () => {
        const res = await request(server.app).get('/')

        expect(res.statusCode).toEqual(200)
    })

    it('should fail to GET whoami', async () => {
        const res = await request(server.app).get('/whoami')

        expect(res.statusCode).toEqual(401)
    })

    /**
     * Todo: fix failed authentication response
     * @link api/src/controllers/UsersCtrl.ts
     */
    it('should fail to login with invalid password', async () => {
        const res = await request(server.app)
            .post('/auth')
            .send({
                email: 'jon.show@mail.com',
                password: 'staima',
            })

        expect(res.statusCode).toEqual(401)
    })

    it('should receive a token after successful login', async () => {
        const res = await request(server.app)
            .post('/auth')
            .send({
                email: 'betty@boop.com',
                password: '123123'
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
})
