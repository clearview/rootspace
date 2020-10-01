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

  getInvite(email: string, spaceId: number, senderId: number): Promise<Invite> {
    return this.createQueryBuilder('invite')
      .where('invite.email = :email', { email })
      .andWhere('invite.spaceId = :spaceId', { spaceId })
      .andWhere('invite.senderId = :senderId', { senderId })
      .andWhere('invite.accepted = false')
      .getOne()
  }

  getByEmailAndSpaceId(email: string, spaceId: number, params: any = { accepted: false }): Promise<Invite[]> {
    return this.createQueryBuilder('invite')
      .where('invite.email = :email', { email })
      .andWhere('invite.spaceId = :spaceId', { spaceId })
      .andWhere('invite.accepted = :accepted', { accepted: params.accepted })
      .getMany()
  }

  getBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.createQueryBuilder('invite')
      .distinctOn(['invite.email'])
      .where('invite.accepted = false AND invite.spaceId = :spaceId', {
        spaceId,
      })
      .getMany()
  }
}
