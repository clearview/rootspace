import { EntityRepository, Repository } from 'typeorm'
import { Invite } from '../entities/Invite'
import { IQueryOptions } from '../../types/query'

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
  getByToken(token: string, params: any = {}): Promise<Invite> {
    const queryBuilder = this.createQueryBuilder('invite').where('invite.token = :token', { token })

    if (params.accepted !== undefined) {
      queryBuilder.andWhere('invite.accepted = :accepted', { accepted: params.accepted })
    }

    return queryBuilder.getOne()
  }

  getInvite(email: string, spaceId: number, senderId: number): Promise<Invite> {
    return this.createQueryBuilder('invite')
      .where('invite.email = :email', { email })
      .andWhere('invite.spaceId = :spaceId', { spaceId })
      .andWhere('invite.senderId = :senderId', { senderId })
      .andWhere('invite.accepted = false')
      .getOne()
  }

  getInvites(
    email: string,
    spaceId: number,
    senderId: number,
    filter: any = {},
    options: IQueryOptions = {}
  ): Promise<Invite[]> {
    const queryBuilder = this.createQueryBuilder('invite')
      .where('invite.email = :email', { email })
      .andWhere('invite.spaceId = :spaceId', { spaceId })
      .andWhere('invite.senderId = :senderId', { senderId })

    if (filter.fromTime) {
      queryBuilder.andWhere('invite.createdAt > :fromTime', { fromTime: filter.fromTime })
    }

    if (options.withDeleted) {
      queryBuilder.withDeleted()
    }

    return queryBuilder.getMany()
  }

  getByEmailAndSpaceId(
    email: string,
    spaceId: number,
    filter: { accepted: boolean } = { accepted: false },
    options: IQueryOptions = {}
  ): Promise<Invite[]> {
    const query = this.createQueryBuilder('invite')
      .where('invite.email = :email', { email })
      .andWhere('invite.spaceId = :spaceId', { spaceId })

    if (filter.accepted !== undefined) {
      query.andWhere('invite.accepted = :accepted', { accepted: filter.accepted })
    }

    if (options.orderBy) {
      query.orderBy('invite.' + options.orderBy.sort, options.orderBy.order ?? 'ASC')
    }

    return query.getMany()
  }

  getBySpaceId(
    spaceId: number,
    filter: { accepted?: boolean } = { accepted: false },
    options: IQueryOptions = {}
  ): Promise<Invite[]> {
    const query = this.createQueryBuilder('invite')
      .distinctOn(['invite.email'])
      .where('invite.spaceId = :spaceId', { spaceId })

    if (filter.accepted !== undefined) {
      query.andWhere('invite.accepted = :accepted', { accepted: filter.accepted })
    }

    if (options.orderBy) {
      // query.addOrderBy('invite.' + options.orderBy.sort, options.orderBy.order ?? 'ASC')
    }

    return query.getMany()
  }
}
