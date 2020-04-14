import { getCustomRepository } from 'typeorm'
import { hashPassword } from '../utils'
import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { UserSignupValidator } from '../validation/user/UserSignupValidator'
import { ValidationError } from '../errors/ValidationError'

export class UserService {
  getByEmail(email: string) {
    return this.getUserRepository().getByEmail(email)
  }

  async signup(data: any): Promise<User> {
    const validator = new UserSignupValidator()

    await validator.validate(data).catch(errors => {
      return Promise.reject(new ValidationError('Can not create user', errors))
    })

    const password = await hashPassword(data.password)

    let user = new User()
    user.name = data.name
    user.email = data.email
    user.password = String(password)
    user.authProvider = 'local'
    user.active = false

    user = this.getUserRepository().create(user)
    user = await this.getUserRepository().save(user)

    delete user.password
    return user
  }

  private getUserRepository() {
    return getCustomRepository(UserRepository)
  }
}
