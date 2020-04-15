import { config } from 'node-config-ts'
import pug from 'pug'
import path from 'path'
import { getCustomRepository } from 'typeorm'
import { hashPassword } from '../utils'
import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { UserSignupValidator } from '../validation/user/UserSignupValidator'
import { HttpError } from '../errors/HttpError'
import { ValidationError } from '../errors/ValidationError'
import { MailService } from './mail/MailService'

export class UserService {
  static mailTemplatesDir =
    path.dirname(require.main.filename) + '/templates/mail/user/'

  private mailSerivce: MailService

  constructor() {
    this.mailSerivce = new MailService()
  }

  getUserByEmail(email: string) {
    return this.getUserRepository().getByEmail(email)
  }

  getUserByConfirmationToken(token: string) {
    return this.getUserRepository().getByConfirmationToken(token)
  }

  async confirm(token: string): Promise<User> {
    const user = await this.getUserByConfirmationToken(token).catch(err => {
      throw new HttpError(400, 'Invalid confirmation token')
    })

    user.confirmed = true
    return await this.getUserRepository().save(user)
  }

  async signup(data: any): Promise<User> {
    const validator = new UserSignupValidator()

    await validator.validate(data).catch(errors => {
      throw new ValidationError(400, 'Can not create user', errors)
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
      .catch(error => {
        throw new HttpError(500, 'Error creating user')
      })

    this.sendConfirmationEmail(user)

    delete user.password
    return user
  }

  async sendConfirmationEmail(user: User) {
    const subject = 'Confirm your registration on Root'
    const confirmUrl =
      config.webDomain + '/user/confirm/' + user.confirmationToken

    const content = pug.renderFile(
      UserService.mailTemplatesDir + 'confirm.pug',
      {
        user,
        confirmUrl
      }
    )

    try {
      await this.mailSerivce.sendMail(user.email, subject, content)
    } catch (error) {
      //
    }
  }

  private getUserRepository() {
    return getCustomRepository(UserRepository)
  }
}
