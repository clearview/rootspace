import httpRequestContext from 'http-request-context'
import { ActivityService, InviteService, SpaceService, UserService, UserSpaceService } from '../'
import { Invite } from '../../database/entities/Invite'
import { clientError } from '../../errors'
import { UserActivities } from '../../database/entities/activities/UserActivities'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'

export class InviteFacade {
  private inviteService: InviteService
  private spaceService: SpaceService
  private userService: UserService
  private userSpaceService: UserSpaceService
  private activityService: ActivityService

  constructor() {
    this.inviteService = InviteService.getInstance()
    this.spaceService = SpaceService.getInstance()
    this.userService = UserService.getInstance()
    this.userSpaceService = UserSpaceService.getInstance()
    this.activityService = ActivityService.getInstance()
  }

  getInvitesBySpaceId(spaceId: number): Promise<Invite[]> {
    return this.inviteService.getInvitesBySpaceId(spaceId)
  }

  async sendToEmails(emails: string[], spaceId: number): Promise<Invite[]> {
    const space = await this.spaceService.requireSpaceById(spaceId)
    const invites = []

    emails = Array.from(new Set(emails))

    for (const email of emails) {
      const user = await this.userService.getUserByEmail(email)

      const invite = user
        ? await this.inviteService.createWithUser(user, space)
        : await this.inviteService.createWithEmail(email, space)

      await this.registerActivityForInvite(UserActivities.Invite_Sent, invite)

      invites.push(invite)
    }

    return invites
  }

  async accept(token: string, id: number, authUserId: number): Promise<Invite> {
    const invite = await this.inviteService.requireInviteByTokenAndId(token, id)

    const user = invite.userId
      ? await this.userService.getUserById(invite.userId)
      : await this.userService.getUserByEmail(invite.email)

    if (!user || user.id !== authUserId) {
      throw clientError('Invalid request')
    }

    const space = await this.spaceService.requireSpaceById(invite.spaceId)

    if (!(await this.userSpaceService.isUserInSpace(user.id, space.id))) {
      await this.userSpaceService.add(user.id, space.id)
    }

    await this.inviteService.accept(invite)

    return invite
  }

  async registerActivityForInvite(userActivity: UserActivities, invite: Invite): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    const activity = ActivityEvent
      .withAction(userActivity)
      .fromActor(actor.id)
      .forEntity(invite)
      .inSpace(invite.spaceId)

    return this.activityService.add(activity)
  }
}
