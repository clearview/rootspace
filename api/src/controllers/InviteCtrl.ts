import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { InviteService } from '../services/InviteService'
import { InviteAcceptValidator } from '../validation/invite/InviteAcceptValidator'

export class InviteCtrl extends BaseCtrl {
  protected inviteService: InviteService

  constructor() {
    super()
    this.inviteService = new InviteService()
  }

  async accept(req: Request, res: Response, next: NextFunction) {
    const validator = new InviteAcceptValidator()

    try {
      await validator.validate(req.body)
      await this.inviteService.accept(req.body.token, req.body.id, req.user.id)
      res.send({ message: 'Invite accepted' })
    } catch (err) {
      next(err)
    }
  }
}
