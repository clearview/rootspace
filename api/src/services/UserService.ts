import { config } from 'node-config-ts'
import pug from 'pug'
import path from 'path'
import { getCustomRepository } from 'typeorm'
import { hashPassword } from '../utils'
import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { ISignupProvider } from '../types/user'
import { clientError, validationFailed } from '../errors/httpError'
import { ClientErrName } from '../errors/httpErrorProperty'
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

  getUserById(id: number): Promise<User | undefined> {
    return this.getUserRepository().findOne(id)
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
      throw clientError('Invalid confirmatio token', ClientErrName.InvalidToken)
    }

    user.emailConfirmed = true
    return await this.getUserRepository().save(user)
  }

  async signup(data: ISignupProvider): Promise<User> {
    const password = await hashPassword(data.password)

    let user = new User()
    user.name = data.name
    user.email = data.email
    user.password = String(password)
    user.authProvider = 'local'
    user.active = false

    user = await this.getUserRepository().save(user)

    this.sendConfirmationEmail(user)

    delete user.password
    return user
  }

  async sendConfirmationEmail(user: User) {
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
      await this.mailSerivce.sendMail(user.email, subject, content)
    } catch (error) {
      //
    }
  }
}
