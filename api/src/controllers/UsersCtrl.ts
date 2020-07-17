import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import passport from '../passport'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { UserRepository } from '../database/repositories/UserRepository'
import { SpaceRepository } from '../database/repositories/SpaceRepository'
import { UserService } from '../services'
import {
  validateUserSignup,
  validateUserUpdate,
  validateChangePassword,
} from '../validation/user'
import { UserUpdateValue, UserChangePasswordValue } from '../values/user'

export class UsersCtrl extends BaseCtrl {
  protected userService: UserService

  constructor() {
    super()
    this.userService = UserService.getInstance()
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
      'local',
      { session: false },
      (err, user, info) => {
        if (err || !user) {
          return next(err)
        }

        const token = jwt.sign({ id: user.id }, config.jwtSecretKey)
        return res.json({ token })
      }
    )(req, res)
  }

  async authGoogleCallback(req: Request, res: Response) {
    const user = req.user
    const token = jwt.sign({ id: user }, config.jwtSecretKey)
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

  async notifications(req: Request, res: Response) {
    const user = await getCustomRepository(UserRepository).getByIdWithNotifications(
      req.user.id,
      req.params?.read ? req.params.read : 'all'
    )

    res.send(user.notifications)
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

    await validateChangePassword(data)
    const value = UserChangePasswordValue.fromObject(data)

    this.userService.changePassword(value, userId, (err, user) => {
      if (err) {
        return next(err)
      }

      res.send(this.responseData(user))
    })
  }
}
