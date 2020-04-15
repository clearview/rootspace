import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import { BaseCtrl } from './BaseCtrl'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { UserService } from '../services/UserService'
import jwt from 'jsonwebtoken'
import { User } from '../entities/User'
import { HttpError } from '../errors/HttpError'

export class UsersCtrl extends BaseCtrl {
  protected userService: UserService

  public constructor() {
    super()
    this.userService = new UserService()
  }

  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.signup(req.body)
      res.send(user)
    } catch (err) {
      next(err)
    }
  }

  public async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.confirm(req.body.token)
      res.send(user)
    } catch (err) {
      next(err)
    }
  }

  public async auth(
    err: Error,
    user: User,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (err || !user) {
        if (!err) {
          err = new HttpError(400, 'An Error occurred')
        }
        return next(err)
      }
      req.login(user, { session: false }, async error => {
        if (error) return next(error)

        const body = { id: user.id, email: user.email }
        const token = jwt.sign({ user: body }, config.jwtSecretKey)

        return res.json({ token })
      })
    } catch (error) {
      return next(new HttpError(400, error.message))
    }
  }

  public async authGoogleCallback(req: Request, res: Response) {
    const user = req.user
    const token = jwt.sign({ id: user }, config.jwtSecretKey)
    res.send({ token })
  }

  public async whoami(req: Request, res: Response) {
    const user = await getCustomRepository(UserRepository).findOne(req.user.id)
    const spaces = await getCustomRepository(SpaceRepository).getByUserId(user.id)
    res.send({ user, spaces })
  }
}
