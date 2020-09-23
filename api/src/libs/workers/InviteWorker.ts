import 'dotenv/config'
import { config } from 'node-config-ts'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { InviteService, MailService, SpaceService, UserService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { UserActivities } from '../../database/entities/activities/UserActivities'
import { Invite } from '../../database/entities/Invite'
import { Space } from '../../database/entities/Space'
import { User } from '../../database/entities/User'
import pug from 'pug'

export class InviteWorker {
  static mailTemplatesDir = `${process.cwd()}/src/templates/mail/invite/`

  private static instance: InviteWorker
  private mailService: MailService
  private inviteService: InviteService
  private spaceService: SpaceService
  private userService: UserService

  private constructor() {
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.inviteService = ServiceFactory.getInstance().getInviteService()
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
    this.userService = ServiceFactory.getInstance().getUserService()
  }

  static getInstance(): InviteWorker {
    if (!InviteWorker.instance) {
      InviteWorker.instance = new InviteWorker()
    }

    return InviteWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {
    switch (event.action) {
      case UserActivities.Invite_Sent:
        await this.sendInvitationEmail(event)
        break
    }
  }

  private async sendInvitationEmail(event: ActivityEvent): Promise<boolean> {
    const space = await this.spaceService.getSpaceById(event.spaceId)
    const invite = await this.inviteService.getInviteById(event.entityId)
    const sender = await this.userService.getUserById(invite.senderId)

    const subject = 'You are invited to ' + space.title + ' space on Root'

    const content = invite.userId
      ? await InviteWorker.getInviteUserEmailTemplate(invite, space, sender)
      : await InviteWorker.getInviteEmailTemplate(invite, space, sender)

    await this.mailService.sendMail(invite.email, subject, content)

    return true
  }

  private static async getInviteUserEmailTemplate(invite: Invite, space: Space, sender: User): Promise<string> {
    return pug.renderFile(InviteWorker.mailTemplatesDir + 'user.pug', {
      space,
      invite,
      sender,
      inviteUrl: InviteWorker.generateInvitationUrl(invite),
    })
  }

  private static async getInviteEmailTemplate(invite: Invite, space: Space, sender: User): Promise<string> {
    return pug.renderFile(InviteWorker.mailTemplatesDir + 'email.pug', {
      space,
      invite,
      sender,
      inviteUrl: InviteWorker.generateInvitationUrl(invite),
      signUpUrl: InviteWorker.getSignUpUrl(),
    })
  }

  private static generateInvitationUrl(invite: Invite): string {
    return config.domain + config.domainInviteAcceptPath + '/' + invite.token
  }

  private static getSignUpUrl(): string {
    return config.domain + config.domainSignupPath
  }
}
