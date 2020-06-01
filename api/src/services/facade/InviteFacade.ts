import { InviteService, SpaceService, UserService, UserSpaceService } from '../'
import { Invite } from '../../entities/Invite'
import { clientError } from '../../errors/client'

export class InviteFacade {
  private intiveService: InviteService
  private spaceService: SpaceService
  private userService: UserService
  private userSpaceService: UserSpaceService

  constructor() {
    this.intiveService = InviteService.getInstance()
    this.spaceService = SpaceService.getInstance()
    this.userService = UserService.getInstance()
    this.userSpaceService = UserSpaceService.getInstance()
  }

  async sendToEmails(emails: string[], spaceId: number): Promise<Invite[]> {
    const space = await this.spaceService.requireSpaceById(spaceId)
    const invites = []

    emails = Array.from(new Set(emails))

    for (const email of emails) {
      const user = await this.userService.getUserByEmail(email)

      const invite = user
        ? await this.intiveService.createWithUser(user, space)
        : await this.intiveService.createWithEmail(email, space)

      invites.push(invite)
    }

    return invites
  }

  async accept(token: string, id: number, authUserId: number): Promise<Invite> {
    const invite = await this.intiveService.requireInviteByTokenAndId(token, id)

    const user = invite.userId
      ? await this.userService.getUserById(invite.userId)
      : await this.userService.getUserByEmail(invite.email)

    if (!user || user.id !== authUserId) {
      throw clientError('Invalid request')
    }

    const space = await this.spaceService.requireSpaceById(invite.spaceId)

    await this.intiveService.accept(invite)
    this.userSpaceService.add(user.id, space.id)

    return invite
  }
}
