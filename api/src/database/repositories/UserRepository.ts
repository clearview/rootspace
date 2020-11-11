import { EntityRepository, Repository, SelectQueryBuilder, getConnection } from 'typeorm'
import { User } from '../entities/User'
import { UserToSpace } from '../entities/UserToSpace'
import { Upload } from '../entities/Upload'
import { IQueryOptions } from '../../types/query'

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

  async getById(id: number, options: IQueryOptions = {}): Promise<User> {
    const queryBuilder = this.createQueryBuilder('user')

    if (options.addSelect) {
      for (const addSelect of options.addSelect) {
        queryBuilder.addSelect(`user.${addSelect}`, `user_${addSelect}`)
      }
    }

    await this.mapAvatar(queryBuilder)

    queryBuilder.where('user.id = :id', { id })

    return queryBuilder.getOne()
  }

  getByEmail(email: string, options: IQueryOptions = {}): Promise<User> {
    const queryBuilder = this.createQueryBuilder('user').where('LOWER(user.email) = :email', {
      email: email.toLowerCase(),
    })

    if (options.addSelect) {
      for (const addSelect of options.addSelect) {
        queryBuilder.addSelect(`user.${addSelect}`, `user_${addSelect}`)
      }
    }

    return queryBuilder.getOne()
  }

  private async mapAvatar(queryBuilder: SelectQueryBuilder<User>): Promise<void> {
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
