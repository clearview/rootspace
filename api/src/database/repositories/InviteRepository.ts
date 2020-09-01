import { EntityRepository, Repository } from 'typeorm'
import { Invite } from '../entities/Invite'

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
  getByToken(token: string, params: any = {}): Promise<Invite> {
    const queryBuilder = this.createQueryBuilder('invite').where('invite.token = :token', { token })

    if (params.accepted) {
      queryBuilder.andWhere('invite.accepted = :accepted', { accepted: params.accepted })
    }

    return queryBuilder.getOne()
  }

  getByEmailAndSpaceId(email: string, spaceId: number): Promise<Invite> {
    return this.createQueryBuilder('invite')
      .where('invite.email = :email AND invite.spaceId = :spaceId', {
        email,
        spaceId,
      })
      .andWhere('invite.accepted = false')
      .getOne()
  }

  getBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.createQueryBuilder('invite')
      .where('invite.accepted = false AND invite.spaceId = :spaceId', {
        spaceId,
      })
      .getMany()
  }
}
