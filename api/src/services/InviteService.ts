import path from 'path'
import pug from 'pug'
import { config } from 'node-config-ts'
import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../repositories/InviteRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { Invite } from '../entities/Invite'
import { Space } from '../entities/Space'
import { MailService } from './mail/MailService'
import { clientError, ClientErrName } from '../errors/client'
import { User } from '../entities/User'

export class InviteService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/invite/'

  private mailSerivce: MailService

  private static instance: InviteService

  private constructor() {
    this.mailSerivce = new MailService()
  }

  static getInstance() {
    if (!InviteService.instance) {
      InviteService.instance = new InviteService()
    }

    return InviteService.instance
  }

  getInviteRepository() {
    return getCustomRepository(InviteRepository)
  }

  getUserToSpaceRepository(): UserToSpaceRepository {
    return getCustomRepository(UserToSpaceRepository)
  }

  getInviteByTokenAndId(
    token: string,
    id: number
  ): Promise<Invite | undefined> {
    return this.getInviteRepository().findOne(id, { where: { token } })
  }

  async requireInviteByTokenAndId(token: string, id: number) {
    const invite = await this.getInviteByTokenAndId(token, id)

    if (invite) {
      throw clientError('Can not find invite ' + ClientErrName.EntityNotFound)
    }

    return invite
  }

  async accept(invite: Invite): Promise<Invite> {
    if (invite.accepted) {
      throw clientError('This invite is no longer active')
    }

    invite.accepted = true
    invite.acceptedDate = new Date(Date.now())

    return await this.getInviteRepository().save(invite)
  }

  createfromArray(invites: string[], space: Space) {
    invites = Array.from(new Set(invites))

    for (const email of invites) {
      this.createWithEmail(email, space).catch((err) => {
        // log error
      })
    }
  }

  async createWithEmail(email: string, space: Space): Promise<Invite> {
    let invite = new Invite()

    invite.spaceId = space.id
    invite.email = email

    invite = await this.getInviteRepository().save(invite)
    this.sendInvitationEmail(invite, space)

    return invite
  }

  async createWithUser(user: User, space: Space): Promise<Invite> {
    let invite = new Invite()

    invite.spaceId = space.id
    invite.userId = user.id
    invite.email = user.email

    invite = await this.getInviteRepository().save(invite)
    this.sendInvitationEmail(invite, space)

    return invite
  }

  private async sendInvitationEmail(invite: Invite, space: Space) {
    const subject = 'You are invited to ' + space.title + ' space on Root'

    const content = invite.userId
      ? await this.getInviteUserEmailTemaplte(invite, space)
      : await this.getInviteEmailTemplate(invite, space)

    try {
      await this.mailService.sendMail(invite.email, subject, content)
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
      inviteUrl: this.generateInvitationUrl(invite),
    })
  }

  private async getInviteEmailTemplate(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteService.mailTemplatesDir + 'email.pug', {
      spaceTitle: space.title,
      inviteUrl: this.generateInvitationUrl(invite),
      signUpUrl: this.getSignUpUrl(),
    })
  }

  private generateInvitationUrl(invite: Invite): string {
    return (
      config.domain +
      config.domainInviteAcceptPath +
      '/' +
      invite.token +
      '/' +
      invite.id
    )
  }

  private getSignUpUrl(): string {
    return config.domain + config.domainSignupPath
  }
}
