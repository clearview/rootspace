import httpRequestContext from 'http-request-context'
import { ActivityService, InviteService, SpaceService, UserService, UserSpaceService } from '../'
import { Invite } from '../../database/entities/Invite'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { UserActivities } from '../../database/entities/activities/UserActivities'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { ServiceFactory } from '../factory/ServiceFactory'

export class InviteFacade {
  private inviteService: InviteService
  private spaceService: SpaceService
  private userService: UserService
  private userSpaceService: UserSpaceService
  private activityService: ActivityService

  constructor() {
    this.inviteService = ServiceFactory.getInstance().getInviteService()
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.userSpaceService = ServiceFactory.getInstance().getUserSpaceService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
  }

  requireInviteById(id: number): Promise<Invite> {
    return this.inviteService.requireInviteById(id)
  }

  getInvitesBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.inviteService.getInvitesBySpaceId(spaceId)
  }

  async sendToEmails(emails: string[], spaceId: number, senderId: number): Promise<Invite[]> {
    const space = await this.spaceService.requireSpaceById(spaceId)
    const invites = []

    emails = Array.from(new Set(emails))

    for (const email of emails) {
      const user = await this.userService.getUserByEmail(email)

      const invite = user
        ? await this.inviteService.createWithUser(user, space, senderId)
        : await this.inviteService.createWithEmail(email, space, senderId)

      await this.registerActivityForInvite(UserActivities.Invite_Sent, invite)

      invites.push(invite)
    }

    return invites
  }

  async accept(token: string, authorizedUserId: number): Promise<Invite[]> {
    const invite = await this.inviteService.requireInviteByToken(token, { accepted: false })

    const user = invite.userId
      ? await this.userService.getUserById(invite.userId)
      : await this.userService.getUserByEmail(invite.email)

    if (!user || user.id !== authorizedUserId) {
      throw clientError('The invitation token is not valid', HttpErrName.InvalidToken, HttpStatusCode.NotFound)
    }

    const space = await this.spaceService.requireSpaceById(invite.spaceId)

    if (!(await this.userSpaceService.isUserInSpace(user.id, space.id))) {
      await this.userSpaceService.add(user.id, space.id)
    }

    const accepted: Invite[] = []

    await this.inviteService.accept(invite)
    accepted.push(invite)

    const otherAccepted = await this.inviteService.acceptByEmailToSpace(invite.email, space.id)
    accepted.push(...otherAccepted)

    await this.registerActivityForInvite(UserActivities.Invite_Accepted, invite)

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

  async registerActivityForInvite(userActivity: UserActivities, invite: Invite): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    const activity = ActivityEvent.withAction(userActivity)
      .fromActor(actor.id)
      .forEntity(invite)
      .inSpace(invite.spaceId)

    return this.activityService.add(activity)
  }
}
