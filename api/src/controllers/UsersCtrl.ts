import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { SpaceRepository } from '../repositories/SpaceRepository'
import jwt from 'jsonwebtoken'
import { config } from 'node-config-ts'

export class UsersCtrl extends BaseCtrl {

  public async signup (req: Request, res: Response) {

  }

  public async auth (req: Request, res: Response) {

  }

  public async authGoogleCallback (req: Request, res: Response) {
    const user = req.user
    const token = jwt.sign({ id: user }, config.jwtSecretKey)
    res.send({ token: token })
  }
}