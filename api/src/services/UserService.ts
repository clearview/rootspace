import bcrypt from 'bcryptjs'
import { hashPassword } from '../utils'
import { validate as uuidValidate } from 'uuid'
import { getCustomRepository } from 'typeorm'
import { PasswordResetRepository } from '../database/repositories/PasswordResetRepository'
import { UserRepository } from '../database/repositories/UserRepository'
import { User } from '../database/entities/User'
import { PasswordReset } from '../database/entities/PasswordReset'
import { ISignupProvider } from '../types/user'
import {
  UserUpdateValue,
  PasswordChangeValue,
  PasswordSetValue,
  PasswordRecoveryValue,
  PasswordResetValue,
} from '../values/user'
import { HttpErrName, HttpStatusCode, clientError, unauthorized } from '../errors'
import { CallbackFunction } from 'ioredis'
import Bull from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { UserActivities } from '../database/entities/activities/UserActivities'
import { ActivityService } from './ActivityService'
import { ServiceFactory } from './factory/ServiceFactory'
import { UserAuthProvider } from '../types/user'

export class UserService {
  private activityService: ActivityService
  private static instance: UserService

  private constructor() {
    this.activityService = ServiceFactory.getInstance().getActivityService()
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

  getUserById(id: number, additionalFields?: string[]): Promise<User | undefined> {
    return this.getUserRepository().getById(id, additionalFields)
  }

  getUserByIdWithNotifications(id: number, read: string): Promise<User | undefined> {
    return this.getUserRepository().getByIdWithNotifications(id, read)
  }

  async requireUserById(id: number, additionalFields?: string[]): Promise<User> {
    const user = await this.getUserById(id, additionalFields)

    if (!user) {
      throw clientError('User not found', HttpErrName.EntityNotFound, HttpStatusCode.BadRequest)
    }

    return user
  }

  getUserByEmail(email: string, selectPassword = false): Promise<User | undefined> {
    return this.getUserRepository().getByEmail(email, selectPassword)
  }

  async requireUserByEmail(email: string, selectPassword = false): Promise<User> {
    const user = await this.getUserByEmail(email, selectPassword)

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
      await this.registerActivityForUser(UserActivities.Signup, user)
    } else {
      await this.registerActivityForUser(UserActivities.Email_Confirmed, user)
    }

    return user
  }

  async update(data: UserUpdateValue, userId: number): Promise<User> {
    const user = await this.getUserById(userId, ['authProvider'])

    if (!user) {
      throw clientError('User not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    Object.assign(user, data.attributes)
    return this.getUserRepository().save(user)
  }

  async changePassword(data: PasswordChangeValue, userId: number, done: CallbackFunction) {
    let user = await this.requireUserById(userId, ['password', 'authProvider'])

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
    let user = await this.requireUserById(userId, ['password', 'authProvider'])

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

    passwordReset = await this.getPasswordResetRepository().save(passwordReset)
    await this.activityService.add(ActivityEvent.withAction(UserActivities.Password_Reset).forEntity(passwordReset))

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
      throw clientError('Not valid request', HttpErrName.InvalidToken, HttpStatusCode.NotFound)
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

  async registerActivityForUserId(userActivity: UserActivities, userId: number): Promise<Bull.Job> {
    const user = await this.getUserById(userId)
    return this.registerActivityForUser(userActivity, user)
  }

  async registerActivityForUser(userActivity: UserActivities, user: User): Promise<Bull.Job> {
    return this.activityService.add(
      ActivityEvent.withAction(userActivity)
        .fromActor(user.id)
        .forEntity(user)
    )
  }
}
