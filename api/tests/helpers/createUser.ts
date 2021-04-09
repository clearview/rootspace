import * as faker from 'faker'
import { User } from '../../src/database/entities/User'
import { UserService } from '../../src/services'
import { UserAuthProvider } from '../../src/types/user'

async function createUser(email: string, password: string): Promise<User> {
    return UserService.getInstance().signup({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password,
        password_confirmation: password,
        authProvider: UserAuthProvider.LOCAL,
        active: true
    }, false)
}

export { createUser }