import 'dotenv/config'
import { config } from 'node-config-ts'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { InviteService, MailService, SpaceService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { UserActivities } from '../../database/entities/activities/UserActivities'
import { Invite } from '../../database/entities/Invite'
import { Space } from '../../database/entities/Space'
import pug from 'pug'

export class InviteWorker {
  static mailTemplatesDir = `${process.cwd()}/src/templates/mail/invite/`

  private static instance: InviteWorker
  private mailService: MailService
  private inviteService: InviteService
  private spaceService: SpaceService

  private constructor() {
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.inviteService = ServiceFactory.getInstance().getInviteService()
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
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

  private async sendInvitationEmail(event: ActivityEvent): Promise<boolean>  {
    const space = await this.spaceService.getSpaceById(event.spaceId)
    const invite = await this.inviteService.getInviteById(event.entityId)

    const subject = 'You are invited to ' + space.title + ' space on Root'

    const content = invite.userId
      ? await InviteWorker.getInviteUserEmailTemplate(invite, space)
      : await InviteWorker.getInviteEmailTemplate(invite, space)

    await this.mailService.sendMail(invite.email, subject, content)

    return true
  }

  private static async getInviteUserEmailTemplate(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteWorker.mailTemplatesDir + 'user.pug', {
      spaceTitle: space.title,
      inviteUrl: InviteWorker.generateInvitationUrl(invite),
    })
  }

  private static async getInviteEmailTemplate(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteWorker.mailTemplatesDir + 'email.pug', {
      spaceTitle: space.title,
      inviteUrl: InviteWorker.generateInvitationUrl(invite),
      signUpUrl: InviteWorker.getSignUpUrl(),
    })
  }

  private static generateInvitationUrl(invite: Invite): string {
    return (
      config.domain +
      config.domainInviteAcceptPath +
      '/' +
      invite.token +
      '/' +
      invite.id
    )
  }

  private static getSignUpUrl(): string {
    return config.domain + config.domainSignupPath
  }
}