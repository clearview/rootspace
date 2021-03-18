import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../database/repositories/InviteRepository'
import { Invite } from '../database/entities/Invite'
import { Space } from '../database/entities/Space'
import { User } from '../database/entities/User'
import { Service } from './Service'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'
import { UserActivitiy } from './activity/activities/user'
import { IQueryOptions } from '../types/query'

export class InviteService extends Service {
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

  getInvites(
    email: string,
    spaceId: number,
    senderId: number,
    filter: any = {},
    options: IQueryOptions = {}
  ): Promise<Invite[]> {
    return this.getInviteRepository().getInvites(email, spaceId, senderId, filter, options)
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
    return this.getInviteRepository().softRemove(invite)
  }

  async cancelByEmailToSpace(email: string, spaceId: number): Promise<Invite[]> {
    const invites = await this.getInviteRepository().getByEmailAndSpaceId(email, spaceId, { accepted: false })

    for (const invite of invites) {
      await this.cancel(invite)
    }

    return invites
  }

  async createWithEmail(email: string, space: Space, senderId: number): Promise<Invite> {
    const invite = new Invite()

    invite.spaceId = space.id
    invite.senderId = senderId
    invite.email = email

    await this.getInviteRepository().save(invite)
    this.notifyActivity(UserActivitiy.invite(invite, senderId))

    return invite
  }

  async createWithUser(user: User, space: Space, senderId: number): Promise<Invite> {
    const invite = new Invite()

    invite.spaceId = space.id
    invite.userId = user.id
    invite.senderId = senderId
    invite.email = user.email

    await this.getInviteRepository().save(invite)
    this.notifyActivity(UserActivitiy.invite(invite, senderId))

    return invite
  }

  async suspendInvitation(email: string, spaceId: number, senderId: number): Promise<boolean> {
    const now = Date.now()

    // -1 hour
    const fromTime = new Date(now - 60 * 60 * 1000)

    const invites = await this.getInvites(email, spaceId, senderId, { fromTime }, { withDeleted: true })

    if (invites.length >= 2) {
      return true
    }

    for (const invite of invites) {
      // -10 minutes
      if (invite.createdAt.valueOf() > now - 10 * 60 * 1000) {
        return true
      }
    }

    return false
  }
}
