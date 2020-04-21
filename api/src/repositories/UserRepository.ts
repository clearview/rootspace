import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getByEmail(email: string, selectPassword = false): Promise<User | undefined> {
    const queryBuilder = this.createQueryBuilder()

    if (selectPassword === true) {
      queryBuilder.addSelect('User.password', 'User_password')
    }

    return queryBuilder
      .where('User.email = :email')
      .setParameter('email', email)
      .getOne()
  }

  getByToken(token: string, id: number): Promise<User | undefined> {
    return this.findOne({
      where: { token, id },
    })
  }
}
