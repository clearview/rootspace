import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../database/repositories/InviteRepository'
import { Invite } from '../database/entities/Invite'
import { Space } from '../database/entities/Space'
import { User } from '../database/entities/User'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'

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

  async requireInviteById(id: number): Promise<Invite> {
    const invite = await this.getInviteById(id)

    if (!invite) {
      throw clientError('Invite not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return invite
  }

  getInvite(email: string, spaceId: number, senderId: number): Promise<Invite> {
    return this.getInviteRepository().getInvite(email, spaceId, senderId)
  }

  getInviteByToken(token: string, params: any = {}): Promise<Invite | undefined> {
    return this.getInviteRepository().getByToken(token, params)
  }

  async requireInviteByToken(token: string, params: any = {}) {
    const invite = await this.getInviteByToken(token, params)

    if (!invite) {
      throw clientError('The invitation token is not valid', HttpErrName.InvalidToken)
    }

    return invite
  }

  getInvitesBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.getInviteRepository().getBySpaceId(spaceId)
  }

  async accept(invite: Invite): Promise<Invite> {
    invite.accepted = true
    invite.acceptedDate = new Date(Date.now())

    return await this.getInviteRepository().save(invite)
  }

  async acceptByEmailToSpace(email: string, spaceId: number): Promise<Invite[]> {
    const invites = await this.getInviteRepository().getByEmailAndSpaceId(email, spaceId)

    for (const invite of invites) {
      await this.accept(invite)
    }

    return invites
  }

  async cancel(invite: Invite) {
    return this.getInviteRepository().remove(invite)
  }

  async cancelByEmailToSpace(email: string, spaceId: number): Promise<Invite[]> {
    const invites = await this.getInviteRepository().getByEmailAndSpaceId(email, spaceId, { accepted: false })

    for (const invite of invites) {
      await this.cancel(invite)
    }

    return invites
  }

  async createWithEmail(email: string, space: Space, senderId: number): Promise<Invite> {
    let invite = await this.getInvite(email, space.id, senderId)

    if (!invite) {
      invite = new Invite()
      invite.spaceId = space.id
      invite.senderId = senderId
      invite.email = email
      invite = await this.getInviteRepository().save(invite)
    }

    return invite
  }

  async createWithUser(user: User, space: Space, senderId: number): Promise<Invite> {
    let invite = await this.getInvite(user.email, space.id, senderId)

    if (!invite) {
      invite = new Invite()
      invite.spaceId = space.id
      invite.userId = user.id
      invite.senderId = senderId
      invite.email = user.email
      invite = await this.getInviteRepository().save(invite)
    }

    return invite
  }
}
