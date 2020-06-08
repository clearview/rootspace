import request from 'supertest'
import Server from '../src/server'

const server = new Server()

describe('Express', () => {

    beforeAll(async () => {
        await server.bootstrap()
        server.listen()
    })

    afterAll(async () => {
        await server.close()
    })

    it('should GET root API', async () => {
        const res = await request(server.app).get('/')

        expect(res.statusCode).toEqual(200)
    })

})
