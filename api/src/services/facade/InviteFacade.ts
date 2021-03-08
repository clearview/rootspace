import { InviteService, SpaceService, UserService, UserSpaceService } from '../'
import { Invite } from '../../database/entities/Invite'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { ServiceFactory } from '../factory/ServiceFactory'
import { InviteSendStatus, Invite as InviteType } from '../../types/invite'

export class InviteFacade {
  private inviteService: InviteService
  private spaceService: SpaceService
  private userService: UserService
  private userSpaceService: UserSpaceService

  constructor() {
    this.inviteService = ServiceFactory.getInstance().getInviteService()
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.userSpaceService = ServiceFactory.getInstance().getUserSpaceService()
  }

  requireInviteById(id: number): Promise<Invite> {
    return this.inviteService.requireInviteById(id)
  }

  getInvitesBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.inviteService.getInvitesBySpaceId(spaceId)
  }

  async sendToEmails(invites: InviteType[], spaceId: number, senderId: number): Promise<object[]> {
    const result: object[] = []
    const space = await this.spaceService.requireSpaceById(spaceId)

    invites = Array.from(new Set(invites))

    for (const { email, role } of invites) {
      const inSpace = await this.userSpaceService.isEmailInSpace(email, space.id)

      if (inSpace === true) {
        result.push({ email, status: InviteSendStatus.Member })
        continue
      }

      const suspend = await this.inviteService.suspendInvitation(email, space.id, senderId)

      if (suspend) {
        result.push({
          email,
          status: InviteSendStatus.Suspended,
        })

        continue
      }

      const user = await this.userService.getUserByEmail(email)

      const invite = user
        ? await this.inviteService.createWithUser(user, role, space, senderId)
        : await this.inviteService.createWithEmail(email, role, space, senderId)

      result.push({
        email: invite.email,
        status: InviteSendStatus.Invited,
        invite,
      })
    }

    return result
  }

  async accept(token: string, authorizedUserId: number): Promise<Invite[]> {
    const invite = await this.inviteService.requireInviteByToken(token, { accepted: false })

    const user = invite.userId
      ? await this.userService.getUserById(invite.userId)
      : await this.userService.getUserByEmail(invite.email)

    if (!user || user.id !== authorizedUserId) {
      throw clientError('The invitation token is not valid', HttpErrName.InvalidToken)
    }

    const space = await this.spaceService.requireSpaceById(invite.spaceId)

    if (!(await this.userSpaceService.isUserInSpace(user.id, space.id))) {
      await this.userSpaceService.add(user.id, space.id, invite.role)
    }

    const accepted: Invite[] = []

    await this.inviteService.accept(invite)
    accepted.push(invite)

    const otherAccepted = await this.inviteService.acceptByEmailToSpace(invite.email, space.id)
    accepted.push(...otherAccepted)

    return accepted
  }

  async cancel(invite: Invite): Promise<Invite[]> {
    if (invite.accepted) {
      throw clientError('Can not cancel this invite', HttpErrName.NotAllowed, HttpStatusCode.BadRequest)
    }

    const canceled: Invite[] = []

    await this.inviteService.cancel(invite)
    canceled.push(invite)

    const otherCanceled = await this.inviteService.cancelByEmailToSpace(invite.email, invite.spaceId)
    canceled.push(...otherCanceled)

    return canceled
  }

  async updateRole(invite: Invite, role: number): Promise<Invite[]> {
    if (invite.accepted) {
      throw clientError('Can not update role this invite', HttpErrName.NotAllowed, HttpStatusCode.BadRequest)
    }

    const updated: Invite[] = []

    await this.inviteService.updateRole(invite, role)
    updated.push(invite)

    return updated
  }
}
