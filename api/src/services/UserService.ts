import bcrypt from 'bcryptjs'
import { hashPassword } from '../utils'
import { getCustomRepository } from 'typeorm'
import { PasswordResetRepository } from '../database/repositories/PasswordResetRepository'
import { UserRepository } from '../database/repositories/UserRepository'
import { User } from '../database/entities/User'
import { PasswordReset } from '../database/entities/PasswordReset'
import { ISignupProvider } from '../types/user'
import {
  UserUpdateValue,
  UserChangePasswordValue,
  PasswordRecoveryValue,
} from '../values/user'
import {
  HttpErrName,
  HttpStatusCode,
  clientError,
  unauthorized,
} from '../errors'
import { MailService } from './mail/MailService'
import { CallbackFunction } from 'ioredis'
import Bull from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { UserActivities } from '../database/entities/activities/UserActivities'
import { ActivityService } from './ActivityService'

export class UserService {
  private activityService: ActivityService
  private static instance: UserService

  private constructor() {
    this.activityService = ActivityService.getInstance()
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

  getPasswordResetRepository() {
    return getCustomRepository(PasswordResetRepository)
  }

  getUsersBySpaceId(spaceId: number): Promise<User[]> {
    return this.getUserRepository().getBySpaceId(spaceId)
  }

  getUserById(
    id: number,
    additionalFields?: string[]
  ): Promise<User | undefined> {
    return this.getUserRepository().getById(id, additionalFields)
  }

  async requireUserById(
    id: number,
    additionalFields?: string[]
  ): Promise<User> {
    const user = await this.getUserById(id, additionalFields)

    if (!user) {
      throw clientError(
        'User not found',
        HttpErrName.EntityNotFound,
        HttpStatusCode.BadRequest
      )
    }

    return user
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

    await this.registerActivityForUser(UserActivities.Email_Confirmed, user)

    return await this.getUserRepository().save(user)
  }

  async signup(
    data: ISignupProvider,
    sendEmailConfirmation: boolean = true
  ): Promise<User> {
    const password = await hashPassword(data.password)

    let user = new User()
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email?.toLowerCase()
    user.password = String(password)
    user.authProvider = 'local'
    user.active = true
    user.emailConfirmed = data.emailConfirmed ? data.emailConfirmed : false

    user = await this.getUserRepository().save(user)
    delete user.password

    if (sendEmailConfirmation) {
      await this.registerActivityForUser(UserActivities.Signup, user)
    } else {
      await this.registerActivityForUser(UserActivities.Email_Confirmed, user)
    }

    return user
  }

  async update(data: UserUpdateValue, userId: number): Promise<User> {
    const user = await this.getUserById(userId, ['authProvider'])

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

    Object.assign(user, data.attributes)
    return this.getUserRepository().save(user)
  }

  async changePassword(
    data: UserChangePasswordValue,
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

    bcrypt.compare(
      data.attributes.password,
      user.password,
      async (err, res) => {
        if (err) {
          return done(err, null)
        }

        if (res !== true) {
          return done(unauthorized(), null)
        }

        const newPassword = await hashPassword(data.attributes.newPassword)
        user.password = String(newPassword)

        user = await this.getUserRepository().save(user)
        delete user.password

        return done(null, user)
      }
    )
  }

  async registerActivityForUserId(userActivity: UserActivities, userId: number): Promise<Bull.Job> {
    const user = await this.getUserById(userId)
    return this.registerActivityForUser(userActivity, user)
  }
  async createPasswordReset(
    data: PasswordRecoveryValue
  ): Promise<PasswordReset> {
    let passwordReset = new PasswordReset()

    passwordReset.email = data.attributes.email
    passwordReset.expiration = new Date(Date.now() + 3600000)

    passwordReset = await this.getPasswordResetRepository().save(passwordReset)
    await this.sendPasswordResetMail(passwordReset)

    return passwordReset
  }

  async registerActivityForUser(userActivity: UserActivities, user: User): Promise<Bull.Job> {
    return this.activityService.add(
      ActivityEvent
        .withAction(userActivity)
        .fromActor(user.id)
        .forEntity(user)
    )
  }

  private async sendPasswordResetMail(
    passwordReset: PasswordReset
  ): Promise<boolean> {

    const subject = 'Root, Password reset'
    const confirmationURL = config.domain + config.domainPasswordResetPath
    const confirmUrl = `${confirmationURL}/${passwordReset.token}/${passwordReset.id}`

    const content = pug.renderFile(
      UserService.mailTemplatesDir + 'passwordReset.pug',
      {
        passwordReset,
        confirmUrl,
      }
    )

    try {
      await this.mailService.sendMail(passwordReset.email, subject, content)
    } catch (error) {
      return false
    }

    return true
  }
}
