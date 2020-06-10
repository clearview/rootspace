import {User} from '../../src/entities/User'
import * as faker from 'faker'
import {hashPassword} from '../../src/utils'

async function createUser(email: string, password: string): Promise<User> {
    const user = new User()
    user.firstName = faker.name.firstName()
    user.lastName = faker.name.lastName()
    user.email = email
    user.password = await hashPassword(password)
    user.authProvider = 'local'
    user.active = true
    user.emailConfirmed = true

    return user
}

export { createUser }