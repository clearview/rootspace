import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { validateSpaceCreate, validateSpaceUpdate } from '../validation/space'
import { clientError, HttpErrName } from '../response/errors'
import { SpaceFacade, InviteFacade } from '../services/facade'

export class SpacesCtrl extends BaseCtrl {
  private inviteFacade: InviteFacade
  private spaceFacade: SpaceFacade

  constructor() {
    super()
    this.inviteFacade = new InviteFacade()
    this.spaceFacade = new SpaceFacade()
  }

  async listAll(req: Request, res: Response) {
    const spaces = await this.spaceFacade.getUserSpaces(req.user.id)
    res.send(spaces)
  }

  async getTree(req: Request, res: Response) {
    const spaceId = Number(req.params.id)
    this.checkSpaceAccess(req, spaceId)

    const nodes = await this.spaceFacade.getTree(spaceId)
    const data = this.responseData(nodes)

    res.send(data)
  }

  async getArchiveTree(req: Request, res: Response) {
    const spaceId = Number(req.params.id)
    this.checkSpaceAccess(req, spaceId)

    const nodes = await this.spaceFacade.getArchiveTree(spaceId)
    const result = this.responseData(nodes)

    res.send(this.responseData(result))
  }

  async deleteArchive(req: Request, res: Response) {
    const spaceId = Number(req.params.id)
    this.checkSpaceAccess(req, spaceId)

    const nodes = await this.spaceFacade.deleteArchive(spaceId, req.user.id)
    const result = this.responseData(nodes)

    res.send(this.responseData(result))
  }

  async favorites(req: Request, res: Response) {
    const spaceId = Number(req.params.id)
    this.checkSpaceAccess(req, spaceId)

    const userId = req.user.id

    const result = await this.spaceFacade.getUserFavorites(userId, spaceId)
    res.send(this.responseData(result))
  }

  async invites(req: Request, res: Response) {
    const spaceId = Number(req.params.id)
    this.checkSpaceAccess(req, spaceId)

    const invites = await this.inviteFacade.getInvitesBySpaceId(spaceId)
    const resData = this.responseData(invites)

    res.send(resData)
  }

  async create(req: Request, res: Response) {
    await validateSpaceCreate(req.body)

    const data = SpaceCreateValue.fromObjectAndUserId(req.body, req.user.id)
    const space = await this.spaceFacade.createSpace(data)

    if (req.body.invites) {
      await this.inviteFacade.sendToEmails(req.body.invites, space.id, req.user.id)
    }

    res.send(space)
  }

  async update(req: Request, res: Response) {
    const spaceId = Number(req.params.id)
    this.checkSpaceAccess(req, spaceId)

    const data = SpaceUpdateValue.fromObject(req.body)

    await validateSpaceUpdate(data)
    const space = await this.spaceFacade.updateSpace(data, spaceId)

    res.send(space)
  }

  public async delete(req: Request, res: Response) {
    throw clientError('Not implemented', HttpErrName.InvalidRequest)
  }
}
