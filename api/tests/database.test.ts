import { connect, disconnect } from './connectors/db.testcontainers'
import { getCustomRepository } from 'typeorm'
import { validate } from 'class-validator'
import { createUser } from './helpers/createUser'
import { UserRepository } from '../src/repositories/UserRepository'

describe('Database', () => {
    beforeAll(async () => {
        await connect(true)
    })

    afterAll(async () => {
        await disconnect()
    })

    it('should save and retrieve a record', async () => {
        const email = 'betty@boop.com'
        const user = await createUser(email, '123123')

        const userRepository = getCustomRepository(UserRepository)

        const loadedUser = await userRepository.findOne({ email })
        expect(loadedUser.email).toBe(user.email)
    })

    it('should fail with constraint error', async () => {
        await expect(createUser(null, '123123'))
            .rejects
            .toMatchObject({
                name: 'QueryFailedError',
                message: 'null value in column "email" violates not-null constraint'
            })
    })

    it('should fail with validation error', async () => {
        const user = await createUser('donald@duck.com', '12')

        await expect(validate(user))
            .resolves
            .toMatchObject(
                expect.arrayContaining([
                    expect.objectContaining({
                        constraints: {
                            length: 'password must be longer than or equal to 3 characters'
                        }
                    })
                ])
            )
    })

})