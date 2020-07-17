import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'
import { UserToSpace } from '../entities/UserToSpace'

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

  getById(id: number, additionalFields?: string[]): Promise<User> {
    const queryBuilder = this.createQueryBuilder()

    if (additionalFields) {
      for (const field of additionalFields) {
        queryBuilder.addSelect(`User.${field}`, `User_${field}`)
      }
    }

    return queryBuilder
      .where('User.id = :id')
      .setParameter('id', id)
      .getOne()
  }

  getByIdWithNotifications(id: number, read: string): Promise<User> {
    const queryBuilder = this.createQueryBuilder('User')
      .leftJoinAndSelect('User.notifications', 'notification')
      .where('User.id = :id', { id })

    switch (read) {
      case 'read':
      case 'unread':
        queryBuilder.andWhere(`notification.isRead = :read`, { read: read === 'read' })
        break
    }

    return queryBuilder.getOne()
  }

  getByEmail(email: string, selectPassword = false): Promise<User> {
    const queryBuilder = this.createQueryBuilder()

    if (selectPassword === true) {
      queryBuilder.addSelect('User.password', 'User_password')
    }

    return queryBuilder
      .where('LOWER(User.email) = :email')
      .setParameter('email', email.toLowerCase())
      .getOne()
  }
}
