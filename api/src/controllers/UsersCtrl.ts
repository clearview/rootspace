import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import passport from '../passport'
import { BaseCtrl } from './BaseCtrl'
import { UserService, ActivityService, UserSettingService, SpaceService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import {
  validateUserSignup,
  validateUserUpdate,
  validatePasswordChange,
  validatePasswordRecovery,
  validatePasswordReset,
  validatePasswordSet,
  UserUpdateValue,
  PasswordChangeValue,
  PasswordRecoveryValue,
  PasswordResetValue,
  PasswordSetValue,
} from '../services/user'
import { UserAuthProvider } from '../types/user'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'

export class UsersCtrl extends BaseCtrl {
  private userService: UserService
  private userSettingsService: UserSettingService
  private spaceService: SpaceService
  private activityService: ActivityService

  constructor() {
    super()
    this.userService = UserService.getInstance()
    this.userSettingsService = UserSettingService.getInstance()
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      await validateUserSignup(req.body)

      const user = await this.userService.signup(req.body)
      res.send(user)
    } catch (err) {
      next(err)
    }
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.confirmEmail(req.body.token, req.body.userId)
      res.send(user)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Todo: return 401 with www-authenticate (NO BODY) for failed login attempt
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
   */
  async auth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(UserAuthProvider.LOCAL, { session: false }, (err, user, info) => {
      if (err || !user) {
        return next(err)
      }

      return res.json(this.signedTokens(user.id))
    })(req, res)
  }

  async authGoogleCallback(req: Request, res: Response) {
    const user = req.user

    const token = jwt.sign({ id: user }, config.jwt.accessToken.secretKey, {
      expiresIn: config.jwt.accessToken.expiresIn,
    })
    const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshToken.secretKey, {
      expiresIn: config.jwt.refreshToken.expiresIn,
    })

    res.send({ token, refreshToken })
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('refreshToken', { session: false }, (err, user, info) => {
      if (err || !user) {
        return next(err)
      }

      return res.json(this.signedTokens(user.id))
    })(req, res)
  }

  signedTokens(userId: number) {
    const token = jwt.sign({ id: userId }, config.jwt.accessToken.secretKey, {
      expiresIn: config.jwt.accessToken.expiresIn,
    })
    const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshToken.secretKey, {
      expiresIn: config.jwt.refreshToken.expiresIn,
    })

    return { token, refreshToken }
  }

  async whoami(req: Request, res: Response) {
    const user = await this.userService.requireUserById(req.user.id, {
      addSelect: ['emailConfirmed', 'authProvider'],
    })

    const spaces = await this.spaceService.getSpacesByUserId(user.id)

    res.send({ user, spaces })
  }

  async profile(req: Request, res: Response) {
    const user = await this.userService.requireUserById(Number(req.params.id))
    const spaces = await this.spaceService.getSpacesJointByUsers(req.user.id, user.id)

    if (spaces.length === 0) {
      throw clientError('Not found', HttpErrName.InvalidRequest, HttpStatusCode.NotFound)
    }

    const spaceIds = spaces.map((space) => space.id)
    const activities = await this.activityService.getByActorId(user.id, { spaceIds })

    Object.assign(user, { activities })

    res.send(this.responseData(user))
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    const userId = req.user.id

    await validateUserUpdate(data, userId)
    const value = UserUpdateValue.fromObject(data)

    const user = await this.userService.update(value, req.user.id)
    const resData = this.responseData(user)

    res.send(resData)
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id
    const user = await this.userService.requireUserById(userId, { addSelect: ['authProvider'] })

    if (user.authProvider !== UserAuthProvider.LOCAL) {
      return next()
    }

    const data = req.body.data
    await validatePasswordChange(data)

    const value = PasswordChangeValue.fromObject(data)

    await this.userService.changePassword(value, userId, (err, result) => {
      if (err) {
        return next(err)
      }

      res.send(this.responseData(result))
    })
  }

  async setPassword(req: Request, res: Response) {
    const userId = req.user.id
    const data = req.body.data

    await validatePasswordSet(data)

    const value = PasswordSetValue.fromObject(data)
    const result = await this.userService.setPassword(value, userId)

    res.send(this.responseData(result))
  }

  async passwordRecovery(req: Request, res: Response) {
    const data = req.body.data
    await validatePasswordRecovery(data)

    const value = PasswordRecoveryValue.fromObject(data)
    const result = await this.userService.createPasswordReset(value)

    res.send(this.responseData({ result }))
  }

  async verifyPasswordReset(req: Request, res: Response) {
    const token = req.params.token
    const result = await this.userService.verifyPasswordReset(token)

    res.send(this.responseData({ result }))
  }

  async passwordReset(req: Request, res: Response) {
    const data = req.body.data
    await validatePasswordReset(data)

    const value = PasswordResetValue.fromObject(data)

    const result = await this.userService.passwordReset(value)
    res.send(this.responseData({ result }))
  }

  async settings(req: Request, res: Response) {
    const userId = Number(req.user.id)
    const spaceId = req.params?.spaceId ? Number(req.params?.spaceId) : null

    const settings = await this.userSettingsService.getSettings(userId, spaceId)

    res.send(settings)
  }

  async updateSettings(req: Request, res: Response) {
    const userId = Number(req.user.id)
    const spaceId = req.params?.spaceId ? Number(req.params?.spaceId) : null
    const data = req.body

    const updatedSettings = await this.userSettingsService.updateSettings(userId, spaceId, data)

    res.send(updatedSettings)
  }
}
