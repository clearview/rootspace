import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { validateSpaceCreate, validateSpaceUpdate } from '../validation/space'
import { clientError, ClientErrName } from '../errors/client'
import { InviteService } from '../services'
import { SpaceFacade } from '../services/facade'

export class SpacesCtrl extends BaseCtrl {
  private inviteService: InviteService
  private spaceFacade: SpaceFacade

  constructor() {
    super()
    this.inviteService = InviteService.getInstance()
    this.spaceFacade = new SpaceFacade()
  }

  public async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const spaces = await this.spaceFacade.getUserSpaces(req.user.id)
      res.send(spaces)
    } catch (err) {
      next(err)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await validateSpaceCreate(req.body)

      const data = SpaceCreateValue.fromObjectAndUserId(req.body, req.user.id)
      const space = await this.spaceFacade.createSpace(data)

      if (req.body.invites) {
        this.inviteService.createfromArray(req.body.invites, space)
      }

      res.send(space)
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = SpaceUpdateValue.fromObject(req.body)

      await validateSpaceUpdate(data)
      const space = await this.spaceFacade.updateSpace(data, id)

      res.send(space)
    } catch (err) {
      next(err)
    }
  }

  public async delete(req: Request, res: Response) {
    throw clientError('Not implemented', ClientErrName.InvalidRequest)
  }
}
