import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { InviteService } from '../services'
import { validateInviteAccept, validateInviteCancel, validateInviteCreate } from '../validation/invite'
import { InviteFacade } from '../services/facade'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class InviteCtrl extends BaseCtrl {
  protected inviteService: InviteService
  private inviteFacade: InviteFacade

  constructor() {
    super()
    this.inviteService = ServiceFactory.getInstance().getInviteService()
    this.inviteFacade = new InviteFacade()
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateInviteCreate(data)

    const invites = await this.inviteFacade.sendToEmails(data.emails, data.spaceId, req.user.id)

    const resData = this.responseData(invites)
    res.send(resData)
  }

  async cancel(req: Request, res: Response) {
    const invites = await this.inviteFacade.cancel(Number(req.params.inviteId))

    const resData = this.responseData(invites)
    res.send(resData)
  }

  async accept(req: Request, res: Response) {
    const data = req.body.data
    await validateInviteAccept(data)

    const result = await this.inviteFacade.accept(data.token, req.user.id)
    res.send(this.responseData(result))
  }
}
