import { config } from 'node-config-ts'
import pug from 'pug'
import path from 'path'
import { getCustomRepository } from 'typeorm'
import { hashPassword } from '../utils'
import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { ISignupProvider } from '../types/user'
import { UserSignupValidator } from '../validation/user/UserSignupValidator'
import { HttpClientError } from '../errors/HttpClientError'
import { HttpValidationError } from '../errors/HttpValidationError'
import { clientError } from '../errors/httpErrors'
import { MailService } from './mail/MailService'

export class UserService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/user/'

  private mailSerivce: MailService

  constructor() {
    this.mailSerivce = new MailService()
  }

  getUserRepository() {
    return getCustomRepository(UserRepository)
  }

  getUserByEmail(email: string, selectPassword = false) {
    return this.getUserRepository().getByEmail(email, selectPassword)
  }

  getUserByToken(token: string, userId: number) {
    return this.getUserRepository().getByToken(token, userId)
  }

  async confirmEmail(token: string, userId: number): Promise<User> {
    const user = await this.getUserByToken(token, userId).catch((err) => {
      throw err
    })

    if (!user) {
      throw new HttpClientError(
        'Invalid confirmation token',
        clientError.invalidToken
      )
    }

    user.emailConfirmed = true
    return await this.getUserRepository().save(user)
  }

  async signup(data: ISignupProvider): Promise<User> {
    const validator = new UserSignupValidator()

    await validator.validate(data).catch((errors) => {
      throw new HttpValidationError('User validation error', errors)
    })

    const password = await hashPassword(data.password)

    let user = new User()
    user.name = data.name
    user.email = data.email
    user.password = String(password)
    user.authProvider = 'local'
    user.active = false

    user = this.getUserRepository().create(user)

    user = await this.getUserRepository()
      .save(user)
      .catch((err) => {
        throw err
      })

    this.sendConfirmationEmail(user)

    delete user.password
    return user
  }

  async sendConfirmationEmail(user: User) {
    const subject = 'Root, email confirmation'
    const confirmationURL = config.appDomain + config.emailConfirmationPath
    const confirmUrl = `${confirmationURL}${user.token}/${user.id}`

    const content = pug.renderFile(
      UserService.mailTemplatesDir + 'confirmEmail.pug',
      {
        user,
        confirmUrl,
      }
    )

    try {
      await this.mailSerivce.sendMail(user.email, subject, content)
    } catch (error) {
      //
    }
  }
}
