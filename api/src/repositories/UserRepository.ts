import { EntityRepository, Repository } from 'typeorm'
import { User } from '../database/entities/User'
import { UserToSpace } from '../database/entities/UserToSpace'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getBySpaceId(spaceId: number): Promise<User[]> {
    return this.createQueryBuilder('user')
      .leftJoin(UserToSpace, 'userToSpace', 'userToSpace.userId = user.id')
      .where('userToSpace.spaceId = :spaceId AND userToSpace.active = true', {
        spaceId,
      })
      .getMany()
  }

  getById(id: number, selectPassword = false): Promise<User> {
    const queryBuilder = this.createQueryBuilder()

    if (selectPassword === true) {
      queryBuilder.addSelect('User.password', 'User_password')
    }

    return queryBuilder
      .where('User.id = :id')
      .setParameter('id', id)
      .getOne()
  }

  getByEmail(email: string, selectPassword = false): Promise<User> {
    const queryBuilder = this.createQueryBuilder()

    if (selectPassword === true) {
      queryBuilder.addSelect('User.password', 'User_password')
    }

    return queryBuilder
      .where('User.email = :email')
      .setParameter('email', email)
      .getOne()
  }
}
