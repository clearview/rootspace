import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { validateSpaceCreate, validateSpaceUpdate } from '../validation/space'
import { clientError, HttpErrName } from '../errors'
import { SpaceFacade, InviteFacade } from '../services/facade'

export class SpacesCtrl extends BaseCtrl {
  private inviteFacade: InviteFacade
  private spaceFacade: SpaceFacade

  constructor() {
    super()
    this.inviteFacade = new InviteFacade()
    this.spaceFacade = new SpaceFacade()
  }

  async getTree(req: Request, res: Response) {
    const spaceId = Number(req.params.id)

    if (!spaceId) {
      throw clientError('Error fetching tree')
    }

    const nodes = await this.spaceFacade.getNodesTree(spaceId)
    const data = this.responseData(nodes)

    res.send(data)
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    const spaces = await this.spaceFacade.getUserSpaces(req.user.id)
    res.send(spaces)
  }

  async invites(req: Request, res: Response, next: NextFunction) {
    const spaceId = Number(req.params.id)

    if (!spaceId) {
      throw clientError('Invalid request')
    }

    const invites = await this.inviteFacade.getInvitesBySpaceId(spaceId)
    const resData = this.responseData(invites)

    res.send(resData)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    await validateSpaceCreate(req.body)

    const data = SpaceCreateValue.fromObjectAndUserId(req.body, req.user.id)
    const space = await this.spaceFacade.createSpace(data)

    if (req.body.invites) {
      this.inviteFacade.sendToEmails(req.body.invites, space.id)
    }

    res.send(space)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = SpaceUpdateValue.fromObject(req.body)

    await validateSpaceUpdate(data)
    const space = await this.spaceFacade.updateSpace(data, id)

    res.send(space)
  }

  public async delete(req: Request, res: Response) {
    throw clientError('Not implemented', HttpErrName.InvalidRequest)
  }
}
