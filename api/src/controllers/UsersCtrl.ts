import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import jwt from 'jsonwebtoken'
import passport from '../passport'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { UserRepository } from '../repositories/UserRepository'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { UserService } from '../services/UserService'
import { HttpError } from '../errors/HttpError'
import { errNames, errNamesArray } from '../errors/errNames'

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

  public async auth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(
      'local',
      { session: false },
      (err, user, info) => {
        if (err || !user) {
          err =
            err ??
            new HttpError(
              info ? info.message : 'Authentication faield',
              401,
              errNames.authenticationFailed
            )

          return next(err)
        }

        const body = { id: user.id, email: user.email }
        const token = jwt.sign({ user: body }, config.jwtSecretKey)

        return res.json({ token })
      }
    )(req, res)
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
