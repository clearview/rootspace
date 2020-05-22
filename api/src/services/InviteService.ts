import path from 'path'
import pug from 'pug'
import { config } from 'node-config-ts'
import { getCustomRepository } from 'typeorm'
import { InviteRepository } from '../repositories/InviteRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { Invite } from '../entities/Invite'
import { Space } from '../entities/Space'
import { UserToSpace } from '../entities/UserToSpace'
import { UserService } from './UserService'
import { SpaceService } from './SpaceService'
import { MailService } from './mail/MailService'
import { clientError, ClientErrName, ClientStatusCode } from '../errors/client'

export class InviteService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/invite/'

  private userService: UserService
  private spaceSerivce: SpaceService
  private mailSerivce: MailService

  constructor() {
    this.userService = new UserService()
    this.spaceSerivce = SpaceService.getInstance()
    this.mailSerivce = new MailService()
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

  async accept(token: string, id: number, authUserId: number): Promise<Invite> {
    const invite = await this.getInviteByTokenAndId(token, id)

    if (!invite) {
      throw clientError('Invite not found', ClientErrName.EntityNotFound)
    }

    const user = invite.userId
      ? await this.userService.getUserById(invite.userId)
      : await this.userService.getUserByEmail(invite.email)

    if (!user || user.id !== authUserId) {
      throw clientError('Invalid request')
    }

    if (invite.accepted) {
      throw clientError('This invite is no longer active')
    }

    const space = await this.spaceSerivce.getSpaceById(invite.spaceId)

    if (!space) {
      throw clientError(
        'Space not found',
        ClientErrName.EntityNotFound,
        ClientStatusCode.NotFound
      )
    }

    const userInSpace = await this.spaceSerivce.isUserInSpace(user.id, space.id)

    if (!userInSpace) {
      const userToSpace = new UserToSpace()
      userToSpace.userId = user.id
      userToSpace.spaceId = space.id

      await this.getUserToSpaceRepository().save(userToSpace)
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

  async createWithEmail(email: string, space: Space) {
    const user = await this.userService.getUserByEmail(email)

    let invite = new Invite()
    invite.email = email
    invite.spaceId = space.id
    invite.userId = user ? user.id : null

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
