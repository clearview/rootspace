import path from 'path'
import pug from 'pug'
import { config } from 'node-config-ts'
import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../repositories/InviteRepository'
import { Invite } from '../entities/Invite'
import { Space } from '../entities/Space'
import { User } from '../entities/User'
import { MailService } from './mail/MailService'
import { clientError, HttpErrName } from '../errors'

export class InviteService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/invite/'

  private mailService: MailService

  private static instance: InviteService

  private constructor() {
    this.mailService = new MailService()
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

  getInvite(email: string, spaceId: number): Promise<Invite> {
    return this.getInviteRepository().getByEmailAndSpaceId(email, spaceId)
  }

  getInviteByTokenAndId(
    token: string,
    id: number
  ): Promise<Invite | undefined> {
    return this.getInviteRepository().findOne(id, { where: { token } })
  }

  async requireInviteByTokenAndId(token: string, id: number) {
    const invite = await this.getInviteByTokenAndId(token, id)

    if (!invite) {
      throw clientError('Invalid invite request', HttpErrName.InvalidToken)
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

  async createWithEmail(email: string, space: Space): Promise<Invite> {
    let invite = await this.getInvite(email, space.id)

    if (!invite) {
      invite = new Invite()
      invite.spaceId = space.id
      invite.email = email
      invite = await this.getInviteRepository().save(invite)
    }

    this.sendInvitationEmail(invite, space)
    return invite
  }

  async createWithUser(user: User, space: Space): Promise<Invite> {
    let invite = await this.getInvite(user.email, space.id)

    if (!invite) {
      invite = new Invite()
      invite.spaceId = space.id
      invite.userId = user.id
      invite.email = user.email
      invite = await this.getInviteRepository().save(invite)
    }

    this.sendInvitationEmail(invite, space)
    return invite
  }

  private async sendInvitationEmail(invite: Invite, space: Space) {
    const subject = 'You are invited to ' + space.title + ' space on Root'

    const content = invite.userId
      ? await InviteService.getInviteUserEmailTemplate(invite, space)
      : await InviteService.getInviteEmailTemplate(invite, space)

    try {
      await this.mailService.sendMail(invite.email, subject, content)
    } catch (error) {
      // log error
    }
  }

  private static async getInviteUserEmailTemplate(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteService.mailTemplatesDir + 'user.pug', {
      spaceTitle: space.title,
      inviteUrl: InviteService.generateInvitationUrl(invite),
    })
  }

  private static async getInviteEmailTemplate(
    invite: Invite,
    space: Space
  ): Promise<string> {
    return pug.renderFile(InviteService.mailTemplatesDir + 'email.pug', {
      spaceTitle: space.title,
      inviteUrl: InviteService.generateInvitationUrl(invite),
      signUpUrl: InviteService.getSignUpUrl(),
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
