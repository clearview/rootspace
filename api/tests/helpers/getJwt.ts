import {Application} from 'express'
import request from 'supertest'

async function getJwt(app: Application, email: string, password: string): Promise<string> {
    const res = await request(app)
        .post('/auth')
        .send({email, password})

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('token')

    return res.body.token
}

export { getJwt }