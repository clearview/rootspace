import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import passport from '../passport'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { UserRepository } from '../repositories/UserRepository'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserService } from '../services'
import {
  validateUserSignup,
  validateUserUpdate,
  validateChangePassword,
} from '../validation/user'
import { IChangePasswordProvider } from '../types/user'
import { UserUpdateValue } from '../values/user'

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
    const user = await getCustomRepository(UserRepository).findOne(req.user.id)
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
    try {
      const data: IChangePasswordProvider = {
        password: req.body.data.password,
        newPassword: req.body.data.newPassword,
        newPassword_confirmation: req.body.data.newPassword_confirmation,
      }

      await validateChangePassword(data)

      this.userService.changePassword(data, req.user.id, (err, user) => {
        if (err) {
          return next(err)
        }

        res.send(user)
      })
    } catch (err) {
      next(err)
    }
  }
}
