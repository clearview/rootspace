import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import passport from '../passport'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { UserRepository } from '../database/repositories/UserRepository'
import { SpaceRepository } from '../database/repositories/SpaceRepository'
import { UserService } from '../services'
import { UserSettingService } from '../services/UserSettingService'
import {
  validateUserSignup,
  validateUserUpdate,
  validateChangePassword,
  validatePasswordRecovery,
  validatePasswordReset,
} from '../validation/user'
import {
  UserUpdateValue,
  UserChangePasswordValue,
  PasswordRecoveryValue,
  PasswordResetValue,
} from '../values/user'
import { UserAuthProvider } from '../values/user/UserAuthProvider'

export class UsersCtrl extends BaseCtrl {
  protected userService: UserService
  protected userSettingsService: UserSettingService

  constructor() {
    super()
    this.userService = UserService.getInstance()
    this.userSettingsService = UserSettingService.getInstance()
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
      const user = await this.userService.confirmEmail(
        req.body.token,
        req.body.userId
      )
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
    return passport.authenticate(
      UserAuthProvider.LOCAL,
      { session: false },
      (err, user, info) => {
        if (err || !user) {
          return next(err)
        }

        const token = jwt.sign({ id: user.id }, config.jwtSecretKey, { expiresIn: config.jwtExpiresIn })
        return res.json({ token })
      }
    )(req, res)
  }

  async authGoogleCallback(req: Request, res: Response) {
    const user = req.user
    const token = jwt.sign({ id: user }, config.jwtSecretKey, { expiresIn: config.jwtExpiresIn })
    res.send({ token })
  }

  async refreshToken(req: Request, res: Response) {
    const user = req.user
    const token = jwt.sign({ id: user.id }, config.jwtSecretKey, { expiresIn: config.jwtExpiresIn })
    res.send({ token })
  }

  async whoami(req: Request, res: Response) {
    const user = await getCustomRepository(UserRepository).getById(
      req.user.id,
      ['emailConfirmed']
    )
    const spaces = await getCustomRepository(SpaceRepository).getByUserId(
      user.id
    )

    res.send({ user, spaces })
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
    const data = req.body.data

    const existingUser = await getCustomRepository(UserRepository).getById(userId, ['authProvider'])

    if (existingUser.authProvider !== UserAuthProvider.LOCAL) {
      data.password = 'fake-password-placeholder'
    }

    await validateChangePassword(data)
    const value = UserChangePasswordValue.fromObject(data)

    await this.userService.changePassword(value, userId, (err, user) => {
      if (err) {
        return next(err)
      }

      res.send(this.responseData(user))
    })
  }

  async passwordRecovery(req: Request, res: Response) {
    const data = req.body.data
    await validatePasswordRecovery(data)

    const value = PasswordRecoveryValue.fromObject(data)
    const result = await this.userService.createPasswordReset(value)

    res.send(this.responseData(result))
  }

  async passwordReset(req: Request, res: Response) {
    const data = req.body.data
    await validatePasswordReset(data)

    const value = PasswordResetValue.fromObject(data)

    const result = await this.userService.passwordReset(value)
    res.send(this.responseData(result))
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
