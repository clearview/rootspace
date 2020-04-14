import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import { BaseCtrl } from './BaseCtrl'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { UserToSpaceRepository } from '../repositories/UserToSpaceRepository'
import { UserService } from '../services/UserService'
import jwt from 'jsonwebtoken'

export class UsersCtrl extends BaseCtrl {
  protected userService: UserService

  protected constructor() {
    super()
    this.userService = new UserService()
  }

  public async signup(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.signup(req.body).catch(err => {
      return next(err)
    })

    if (user) {
      res.send(user)
    }
  }

  public async auth(req: Request, res: Response) {
    //
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
