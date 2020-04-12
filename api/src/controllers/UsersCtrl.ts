import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { config } from 'node-config-ts'
import { UserRepository } from '../repositories/UserRepository'
import jwt from 'jsonwebtoken'

export class UsersCtrl extends BaseCtrl {
  public async signup(req: Request, res: Response) {
    //
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
    res.send(user)
  }
}
