import path from 'path'
import pug from 'pug'

import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../repositories/InviteRepository'
import { Invite } from '../entities/Invite'
import { Space } from '../entities/Space'
import { UserService } from '../services/UserService'
import { MailService } from './mail/MailService'

export class InviteService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/invite/'

  private userService: UserService
  private mailSerivce: MailService

  constructor() {
    this.userService = new UserService()
    this.mailSerivce = new MailService()
  }

  createfromArray(invites: string[], space: Space) {
    for (const email of invites) {
      this.createWithEmail(email, space)
    }
  }

  async createWithEmail(email: string, space: Space) {
    const user = await this.userService.getByEmail(email)

    let invite = new Invite()
    invite.email = email
    invite.spaceId = space.id
    invite.userId = user ? user.id : null

    invite = this.getInviteRepository().create(invite)
    invite = await this.getInviteRepository().save(invite)

    this.sendInvitationEmail(invite, space)
  }

  async sendInvitationEmail(invite: Invite, space: Space) {
    const subject = 'You are invited to ' + space.title + ' space on Root'

    const content = invite.userId
      ? await this.getInviteUserEmailTemaplte(invite, space)
      : await this.getInviteEmailTemplate(invite, space)

    try {
      await this.mailSerivce.sendMail(invite.email, subject, content)
    } catch (error) {
      //
    }
  }

  private async getInviteUserEmailTemaplte(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteService.mailTemplatesDir + 'user.pug', {
      spaceTitle: space.title,
      inviteUrl: this.generateInvitationUrl(invite)
    })
  }

  private async getInviteEmailTemplate(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteService.mailTemplatesDir + 'email.pug', {
      spaceTitle: space.title,
      inviteUrl: this.generateInvitationUrl(invite),
      signUpUrl: this.getSignUpUrl()
    })
  }

  private generateInvitationUrl(invite: Invite): string {
    return '[Invite URL]'
  }

  private getSignUpUrl(): string {
    return '[SignUp URL]'
  }

  private getInviteRepository(): InviteRepository {
    return getCustomRepository(InviteRepository)
  }
}
