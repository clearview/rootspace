import { EntityRepository, Repository, Entity } from 'typeorm'
import { User } from '../entities/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getByEmail(email: string) {
    return this.findOne({
      where: { email }
    })
  }

  getByConfirmationToken(confirmationToken: string) {
    return this.findOne({
      where: { confirmationToken }
    })
  }
}
