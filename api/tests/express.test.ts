import request from 'supertest'
import Server from '../src/server'
import {spawnTestDatabase, destroyTestDatabase} from './helpers/db'

const server = new Server()

describe('Express', () => {

    beforeAll(async () => {
        await spawnTestDatabase()
        await server.bootstrap()
        server.listen(3333)
    })

    afterAll(async () => {
        await server.close()
        await destroyTestDatabase()
    })

    it('should GET root API', async () => {
        const res = await request(server.app).get('/')

        expect(res.statusCode).toEqual(200)
    })

})
