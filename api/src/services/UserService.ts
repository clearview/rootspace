import { config } from 'node-config-ts'
import pug from 'pug'
import bcrypt from 'bcryptjs'
import { hashPassword } from '../utils'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'
import { User } from '../database/entities/User'
import {
  ISignupProvider,
  IUserUpdateProvider,
  IChangePasswordProvider,
} from '../types/user'
import {
  HttpErrName,
  HttpStatusCode,
  clientError,
  unauthorized,
} from '../errors'
import { MailService } from './mail/MailService'
import { CallbackFunction } from 'ioredis'

export class UserService {
  static mailTemplatesDir = `${process.cwd()}/src/templates/mail/user/`

  private mailService: MailService

  private static instance: UserService

  private constructor() {
    this.mailService = new MailService()
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }

    return UserService.instance
  }

  getUserRepository() {
    return getCustomRepository(UserRepository)
  }

  getUsersBySpaceId(spaceId: number): Promise<User[]> {
    return this.getUserRepository().getBySpaceId(spaceId)
  }

  getUserById(id: number, additionalFields?: string[]): Promise<User | undefined> {
    return this.getUserRepository().getById(id, additionalFields)
  }

  getUserByEmail(
    email: string,
    selectPassword = false
  ): Promise<User | undefined> {
    return this.getUserRepository().getByEmail(email, selectPassword)
  }

  getUserByTokenAndId(
    token: string,
    userId: number
  ): Promise<User | undefined> {
    return this.getUserRepository().findOne(userId, { where: { token } })
  }

  async confirmEmail(token: string, userId: number): Promise<User> {
    const user = await this.getUserByTokenAndId(token, userId).catch((err) => {
      throw err
    })

    if (!user) {
      throw clientError('Invalid confirmation token', HttpErrName.InvalidToken)
    }

    if (user.emailConfirmed) {
      throw clientError('Email already confirmed')
    }

    user.emailConfirmed = true
    user.active = true

    return await this.getUserRepository().save(user)
  }

  async signup(data: ISignupProvider): Promise<User> {
    const password = await hashPassword(data.password)

    let user = new User()
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email.toLowerCase()
    user.password = String(password)
    user.authProvider = 'local'
    user.active = true

    user = await this.getUserRepository().save(user)
    delete user.password

    await this.sendConfirmationEmail(user)

    return user
  }

  async update(data: IUserUpdateProvider, userId: number): Promise<User> {
    const user = await this.getUserById(userId)

    if (!user) {
      throw clientError(
        'User not found',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
    }

    if (user.authProvider !== 'local') {
      throw clientError(
        'Error updating user',
        HttpErrName.EntityUpdateFailed,
        HttpStatusCode.Forbidden
      )
    }

    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email.toLowerCase()

    return await this.getUserRepository().save(user)
  }

  async changePassword(
    data: IChangePasswordProvider,
    userId: number,
    done: CallbackFunction
  ) {
    let user = await this.getUserById(userId, ['password'])

    if (!user) {
      return done(
        clientError(
          'User not found',
          HttpErrName.EntityNotFound,
          HttpStatusCode.NotFound
        ),
        null
      )
    }

    bcrypt.compare(data.password, user.password, async (err, res) => {
      if (err) {
        return done(err, null)
      }

      if (res !== true) {
        return done(unauthorized(), null)
      }

      const newPassword = await hashPassword(data.newPassword)
      user.password = String(newPassword)

      user = await this.getUserRepository().save(user)
      delete user.password

      return done(null, user)
    })
  }

  private async sendConfirmationEmail(user: User): Promise<boolean> {
    const subject = 'Root, email confirmation'
    const confirmationURL = config.domain + config.domainEmailConfirmationPath
    const confirmUrl = `${confirmationURL}/${user.token}/${user.id}`

    const content = pug.renderFile(
      UserService.mailTemplatesDir + 'confirmEmail.pug',
      {
        user,
        confirmUrl,
      }
    )

    try {
      await this.mailService.sendMail(user.email, subject, content)
    } catch (error) {
      return false
    }

    return true
  }
}
