import path from 'path'
import pug from 'pug'
import { config } from 'node-config-ts'
import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../repositories/InviteRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { Invite } from '../entities/Invite'
import { Space } from '../entities/Space'
import { UserToSpace } from '../entities/UserToSpace'
import { UserService } from '../services/UserService'
import { SpaceService } from '../services/SpaceService'
import { MailService } from './mail/MailService'
import { clientError } from '../errors/httpError'
import { ClientErrName, ClientStatusCode } from '../errors/httpErrorProperty'

export class InviteService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/invite/'

  private userService: UserService
  private spaceSerivce: SpaceService
  private mailSerivce: MailService

  constructor() {
    this.userService = new UserService()
    this.spaceSerivce = new SpaceService()
    this.mailSerivce = new MailService()
  }

  getInviteRepository() {
    return getCustomRepository(InviteRepository)
  }

  getUserToSpaceRepository(): UserToSpaceRepository {
    return getCustomRepository(UserToSpaceRepository)
  }

  async accept(token: string, id: number, authUserId: number) {
    const invite = await this.getInviteRepository().getByToken(token, id)

    if (!invite) {
      throw clientError('Invite not found', ClientErrName.EntityNotFound)
    }

    if (invite.accepted) {
      throw clientError(
        'This invite is no longer active',
        ClientErrName.InvalidRequest
      )
    }

    const user = invite.userId
      ? await this.userService.getUserById(invite.userId)
      : await this.userService.getUserByEmail(invite.email)

    if (!user) {
      throw clientError('Invalid request')
    }

    if (user.id !== authUserId) {
      throw clientError('Invalid request')
    }

    const space = await this.spaceSerivce.getSpaceById(invite.spaceId)

    if (!space) {
      throw clientError(
        'Space not found',
        ClientErrName.EntityNotFound,
        ClientStatusCode.NotFound
      )
    }

    const userToSpace = new UserToSpace()
    userToSpace.userId = user.id
    userToSpace.spaceId = space.id

    await this.getUserToSpaceRepository().save(userToSpace)

    invite.accepted = true
    invite.acceptedDate = new Date(Date.now())

    return await this.getInviteRepository().save(invite)
  }

  async createfromArray(invites: string[], space: Space) {
    for (const email of invites) {
      this.createWithEmail(email, space)
    }
  }

  async createWithEmail(email: string, space: Space) {
    const user = await this.userService.getUserByEmail(email)

    let invite = new Invite()
    invite.email = email
    invite.spaceId = space.id
    invite.userId = user ? user.id : null

    invite = this.getInviteRepository().create(invite)
    invite = await this.getInviteRepository().save(invite)

    this.sendInvitationEmail(invite, space)
  }

  private async sendInvitationEmail(invite: Invite, space: Space) {
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
