import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'

export class UploadsCtrl extends BaseCtrl {

  constructor() {
    super()
  }

  async index(req: Request, res: Response, next: NextFunction) {
    res.send(req.file)
  }

}
