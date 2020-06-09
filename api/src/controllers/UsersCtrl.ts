import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import passport from '../passport'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { UserRepository } from '../repositories/UserRepository'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserService } from '../services/UserService'
import {
  validateUserSignup,
  validateUserUpdate,
  validateChangePassword,
} from '../validation/user'
import { IUserUpdateProvider, IChangePasswordProvider } from '../types/user'

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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data: IUserUpdateProvider = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      }

      await validateUserUpdate(data, req.user.id)

      const user = await this.userService.update(data, req.user.id)
      res.send(user)
    } catch (err) {
      next(err)
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data: IChangePasswordProvider = {
        password: req.body.password,
        newPassword: req.body.newPassword,
        newPassword_confirmation: req.body.newPassword_confirmation,
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
