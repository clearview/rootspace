import * as faker from 'faker'
import { User } from '../../src/database/entities/User'
import { UserService } from '../../src/services'

async function createUser(email: string, password: string): Promise<User> {
    return UserService.getInstance().signup({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password,
        password_confirmation: password,
        authProvider: 'local',
        active: true
    }, false)
}

export { createUser }