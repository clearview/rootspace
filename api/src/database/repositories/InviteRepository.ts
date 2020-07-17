import { EntityRepository, Repository } from 'typeorm'
import { Invite } from '../entities/Invite'

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
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
