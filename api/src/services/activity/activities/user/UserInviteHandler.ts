import { config } from 'node-config-ts'
import pug from 'pug'
import { Invite } from '../../../../database/entities/Invite'
import { Space } from '../../../../database/entities/Space'
import { User } from '../../../../database/entities/User'
import { IActivityHandler, IAppActivityData } from '../types'
import { ServiceFactory } from '../../../../services/factory/ServiceFactory'
import { InviteService, SpaceService, UserService, MailService } from '../../../'

const mailTemplatesDir = `${process.cwd()}/src/templates/mail/invite/`

export class UserInviteHandler implements IActivityHandler {
  private inviteService: InviteService
  private spaceService: SpaceService
  private userService: UserService
  private mailService: MailService

  private data: IAppActivityData
  private invite: Invite
  private space: Space
  private sender: User

  private constructor(data: IAppActivityData) {
    this.inviteService = ServiceFactory.getInstance().getInviteService()
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.mailService = ServiceFactory.getInstance().getMailService()

    this.data = data
  }

  async process(): Promise<void> {
    await this.init()
    await this.sendInvitationEmail()
  }

  async init(): Promise<void> {
    this.invite = await this.inviteService.requireInviteById(this.data.entityId)

    this.space = await this.spaceService.getSpaceById(this.invite.spaceId)
    this.sender = await this.userService.getUserById(this.invite.senderId)
  }

  private async sendInvitationEmail(): Promise<void> {
    const subject = 'You are invited to ' + this.space.title + ' space on Root'

    const content = this.invite.userId ? this.getInviteUserEmailTemplate() : this.getInviteEmailTemplate()

    await this.mailService.sendMail(this.invite.email, subject, content)
  }

  private getInviteUserEmailTemplate(): string {
    return pug.renderFile(mailTemplatesDir + 'user.pug', {
      space: this.space,
      invite: this.invite,
      sender: this.sender,
      inviteUrl: this.getInvitationUrl(),
    })
  }

  private getInviteEmailTemplate(): string {
    return pug.renderFile(mailTemplatesDir + 'email.pug', {
      space: this.space,
      invite: this.invite,
      sender: this.sender,
      inviteUrl: this.getInvitationUrl(),
      signUpUrl: this.getSignUpUrl(),
    })
  }

  private getInvitationUrl(): string {
    return config.domain + config.domainInviteAcceptPath + '/' + this.invite.token
  }

  private getSignUpUrl(): string {
    return config.domain + config.domainSignupPath
  }
}
