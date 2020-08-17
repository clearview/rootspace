import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { InviteService } from '../services/InviteService'
import {
  validateInviteAccept, validateInviteCancel,
  validateInviteCreate,
} from '../validation/invite'
import { InviteFacade } from '../services/facade'

export class InviteCtrl extends BaseCtrl {
  protected inviteService: InviteService
  private inviteFacade: InviteFacade

  constructor() {
    super()
    this.inviteService = InviteService.getInstance()
    this.inviteFacade = new InviteFacade()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateInviteCreate(data)

      const invites = await this.inviteFacade.sendToEmails(
        data.emails,
        data.spaceId
      )

      const resData = this.responseData(invites)
      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    const invites = await this.inviteFacade.cancel(
      Number(req.params.inviteId)
    )

    const resData = this.responseData(invites)
    res.send(resData)
  }

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateInviteAccept(data)

      const invite = await this.inviteFacade.accept(
        data.token,
        data.id,
        req.user.id
      )

      const resData = this.responseData(invite)
      res.send(resData)
    } catch (err) {
      next(err)
    }
  }
}
