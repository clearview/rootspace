import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'
import { User } from '../entities/User'
import { UserToSpace } from '../entities/UserToSpace'
import { Upload } from '../entities/Upload'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getBySpaceId(spaceId: number): Promise<User[]> {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoin(UserToSpace, 'userToSpace', 'userToSpace.userId = user.id')
      .where('userToSpace.spaceId = :spaceId AND userToSpace.active = true', {
        spaceId,
      })

    this.mapAvatar(queryBuilder)

    return queryBuilder.getMany()
  }

  getById(id: number, additionalFields?: string[]): Promise<User> {
    const queryBuilder = this.createQueryBuilder()

    if (additionalFields) {
      for (const field of additionalFields) {
        queryBuilder.addSelect(`User.${field}`, `User_${field}`)
      }
    }

    this.mapAvatar(queryBuilder)

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
      .where('LOWER(User.email) = :email')
      .setParameter('email', email.toLowerCase())
      .getOne()
  }

  private mapAvatar(queryBuilder: SelectQueryBuilder<User>): void {
    const alias = queryBuilder.alias

    queryBuilder.leftJoinAndMapOne(
      alias + '.avatar',
      Upload,
      'upload',
      'upload.entityId = ' + alias + '.id AND upload.entity = :entity',
      {
        entity: 'User',
      }
    )
  }
}
