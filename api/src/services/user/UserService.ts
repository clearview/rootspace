import bcrypt from 'bcryptjs'
import { hashPassword } from '../../utils'
import { validate as uuidValidate } from 'uuid'
import { CallbackFunction } from 'ioredis'
import { getCustomRepository } from 'typeorm'
import { PasswordResetRepository } from '../../database/repositories/PasswordResetRepository'
import { UserRepository } from '../../database/repositories/UserRepository'
import { User } from '../../database/entities/User'
import { PasswordReset } from '../../database/entities/PasswordReset'
import { ISignupProvider } from '../../types/user'
import {
  UserUpdateValue,
  PasswordChangeValue,
  PasswordSetValue,
  PasswordRecoveryValue,
  PasswordResetValue,
} from './values'
import { HttpErrName, HttpStatusCode, clientError, unauthorized } from '../../response/errors'
import { UserAuthProvider } from '../../types/user'
import { IQueryOptions } from '../../types/query'
import { Service } from '../Service'
import { UserActivitiy } from '../activity/activities/user'
import { PasswordResetActivity } from '../activity/activities/app'

export class UserService extends Service {
  private static instance: UserService

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

  getUserById(id: number, options: IQueryOptions = {}): Promise<User | undefined> {
    return this.getUserRepository().getById(id, options)
  }

  async requireUserById(id: number, options: IQueryOptions = {}): Promise<User> {
    const user = await this.getUserById(id, options)

    if (!user) {
      throw clientError('User not found', HttpErrName.EntityNotFound, HttpStatusCode.BadRequest)
    }

    return user
  }

  getUserByEmail(email: string, options: IQueryOptions = {}): Promise<User | undefined> {
    return this.getUserRepository().getByEmail(email, options)
  }

  async requireUserByEmail(email: string, options: IQueryOptions = {}): Promise<User> {
    const user = await this.getUserByEmail(email, options)

    if (!user) {
      throw clientError('User not found', HttpErrName.EntityNotFound, HttpStatusCode.BadRequest)
    }

    return user
  }

  getUserByTokenAndId(token: string, userId: number): Promise<User | undefined> {
    return this.getUserRepository().findOne(userId, { where: { token } })
  }

  getPasswordResetByToken(token: string): Promise<PasswordReset | undefined> {
    return this.getPasswordResetRepository().getByToken(token)
  }

  getPasswordResetById(id: number): Promise<PasswordReset | undefined> {
    return this.getPasswordResetRepository().findOne(id)
  }

  async confirmEmail(token: string, userId: number): Promise<User> {
    const user = await this.getUserByTokenAndId(token, userId).catch((err) => {
      throw err
    })

    if (!user) {
      throw clientError('This email confirmation token is invalid', HttpErrName.InvalidToken)
    }

    if (user.emailConfirmed) {
      throw clientError('Email already confirmed')
    }

    user.emailConfirmed = true
    user.active = true

    await this.notifyActivity(UserActivitiy.emailConfirmed(user))

    return await this.getUserRepository().save(user)
  }

  async signup(data: ISignupProvider, sendEmailConfirmation: boolean = true): Promise<User> {
    let user = new User()
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email?.toLowerCase()
    user.password = data.password ? await hashPassword(data.password) : null
    user.authProvider = data.authProvider ? data.authProvider : UserAuthProvider.LOCAL
    user.active = true
    user.emailConfirmed = data.emailConfirmed ? data.emailConfirmed : false

    user = await this.getUserRepository().save(user)
    delete user.password

    if (sendEmailConfirmation) {
      await this.notifyActivity(UserActivitiy.signup(user))
    } else {
      await this.notifyActivity(UserActivitiy.emailConfirmed(user))
    }

    return user
  }

  async update(data: UserUpdateValue, userId: number): Promise<User> {
    const user = await this.getUserById(userId, { addSelect: ['authProvider'] })

    if (!user) {
      throw clientError('User not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    Object.assign(user, data.attributes)
    return this.getUserRepository().save(user)
  }

  async changePassword(data: PasswordChangeValue, userId: number, done: CallbackFunction) {
    let user = await this.requireUserById(userId, { addSelect: ['password', 'authProvider'] })

    bcrypt.compare(data.attributes.password, user.password, async (err, res) => {
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
    })
  }

  async setPassword(data: PasswordSetValue, userId: number): Promise<User> {
    let user = await this.requireUserById(userId, { addSelect: ['password', 'authProvider'] })

    user.password = String(await hashPassword(data.attributes.newPassword))
    user.authProvider = UserAuthProvider.LOCAL

    user = await this.getUserRepository().save(user)
    delete user.password

    return user
  }

  async createPasswordReset(data: PasswordRecoveryValue): Promise<boolean> {
    const user = await this.getUserByEmail(data.attributes.email)

    if (!user) {
      return true
    }

    let passwordReset = new PasswordReset()

    passwordReset.email = data.attributes.email
    passwordReset.expiration = new Date(Date.now() + 3600000)
    passwordReset.urlQueryParams = data.attributes.urlQueryParams

    passwordReset = await this.getPasswordResetRepository().save(passwordReset)

    await this.notifyActivity(PasswordResetActivity.create(passwordReset))

    return true
  }

  async verifyPasswordReset(token: string): Promise<boolean> {
    if (uuidValidate(token) === false) {
      return false
    }

    const passwordReset = await this.getPasswordResetByToken(token)

    if (!passwordReset || this.isPasswordResetExpired(passwordReset)) {
      return false
    }

    return true
  }

  async passwordReset(data: PasswordResetValue): Promise<boolean> {
    const passwordReset = await this.getPasswordResetByToken(data.attributes.token)

    if (!passwordReset || this.isPasswordResetExpired(passwordReset)) {
      throw clientError('The reset password token has expired', HttpErrName.InvalidToken, HttpStatusCode.NotFound)
    }

    const user = await this.requireUserByEmail(passwordReset.email)
    const newPassword = await hashPassword(data.attributes.password)
    user.password = String(newPassword)

    await this.getUserRepository().save(user)

    passwordReset.active = false
    await this.getPasswordResetRepository().save(passwordReset)

    return true
  }

  isPasswordResetExpired(passwordReset: PasswordReset): boolean {
    if (passwordReset.active !== true || passwordReset.expiration <= new Date(Date.now())) {
      return true
    }

    return false
  }
}
