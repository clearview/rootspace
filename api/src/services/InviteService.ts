import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../database/repositories/InviteRepository'
import { Invite } from '../database/entities/Invite'
import { Space } from '../database/entities/Space'
import { User } from '../database/entities/User'
import { clientError, HttpErrName } from '../errors'

export class InviteService {
  private static instance: InviteService

  static getInstance() {
    if (!InviteService.instance) {
      InviteService.instance = new InviteService()
    }

    return InviteService.instance
  }

  getInviteRepository() {
    return getCustomRepository(InviteRepository)
  }

  getInviteById(id: number): Promise<Invite | undefined> {
    return this.getInviteRepository().findOne(id)
  }

  getInvite(email: string, spaceId: number): Promise<Invite> {
    return this.getInviteRepository().getByEmailAndSpaceId(email, spaceId)
  }

  getInviteByToken(token: string, params: any = {}): Promise<Invite | undefined> {
    return this.getInviteRepository().getByToken(token, params)
  }

  async requireInviteByToken(token: string, params: any = {}) {
    const invite = await this.getInviteByToken(token, params)

    if (!invite) {
      throw clientError('Invalid invite request', HttpErrName.InvalidToken)
    }

    return invite
  }

  getInvitesBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.getInviteRepository().getBySpaceId(spaceId)
  }

  async accept(invite: Invite): Promise<Invite> {
    if (invite.accepted) {
      throw clientError('This invite is no longer active')
    }

    invite.accepted = true
    invite.acceptedDate = new Date(Date.now())

    return await this.getInviteRepository().save(invite)
  }

  async cancel(invite: Invite) {
    return this.getInviteRepository().remove(invite)
  }

  async createWithEmail(email: string, space: Space): Promise<Invite> {
    let invite = await this.getInvite(email, space.id)

    if (!invite) {
      invite = new Invite()
      invite.spaceId = space.id
      invite.email = email
      invite = await this.getInviteRepository().save(invite)
    }

    return invite
  }

  async createWithUser(user: User, space: Space): Promise<Invite> {
    let invite = await this.getInvite(user.email, space.id)

    if (!invite) {
      invite = new Invite()
      invite.spaceId = space.id
      invite.userId = user.id
      invite.email = user.email
      invite = await this.getInviteRepository().save(invite)
    }

    return invite
  }
}
