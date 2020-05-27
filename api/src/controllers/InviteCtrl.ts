import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { InviteService } from '../services/InviteService'
import { InviteAcceptValidator } from '../validation/invite/InviteAcceptValidator'

export class InviteCtrl extends BaseCtrl {
  protected inviteService: InviteService

  constructor() {
    super()
    this.inviteService = InviteService.getInstance()
  }

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const validator = new InviteAcceptValidator()
      await validator.validate(req.body)

      const invite = await this.inviteService.accept(
        req.body.token,
        req.body.id,
        req.user.id
      )

      res.send(invite)
    } catch (err) {
      next(err)
    }
  }
}
