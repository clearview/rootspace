import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { InviteService } from '../services'
import { validateInviteAccept, validateInviteCreate } from '../validation/invite'
import { InviteFacade } from '../services/facade'

export class InvitesCtrl extends BaseCtrl {
  protected inviteService: InviteService
  private inviteFacade: InviteFacade

  constructor() {
    super()
    this.inviteFacade = new InviteFacade()
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateInviteCreate(data)

    const spaceId = Number(data.spaceId)
    this.isSpaceAdmin(req, spaceId)

    const invites = await this.inviteFacade.sendToEmails(data.invites, data.spaceId, req.user.id)
    res.send(this.responseData(invites))
  }

  async cancel(req: Request, res: Response) {
    const invite = await this.inviteFacade.requireInviteById(Number(req.params.inviteId))
    this.isSpaceAdmin(req, invite.spaceId)

    const result = await this.inviteFacade.cancel(invite)
    res.send(this.responseData(result))
  }

  async accept(req: Request, res: Response) {
    const data = req.body.data
    await validateInviteAccept(data)

    const result = await this.inviteFacade.accept(data.token, req.user.id)
    res.send(this.responseData(result))
  }

  async updateRole(req: Request, res: Response) {
    const data = req.body.data
    const invite = await this.inviteFacade.requireInviteById(Number(req.params.inviteId))

    this.isSpaceAdmin(req, invite.spaceId)

    const result = await this.inviteFacade.updateRole(invite, data.role)
    res.send(this.responseData(result))
  }
}
