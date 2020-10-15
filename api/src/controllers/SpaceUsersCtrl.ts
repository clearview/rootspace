import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { UserService } from '../services'
import { SpaceFacade } from '../services/facade'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class SpaceUsersCtrl extends BaseCtrl {
  private userService: UserService
  private spaceFacade: SpaceFacade

  constructor() {
    super()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.spaceFacade = new SpaceFacade()
  }

  async listAll(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    this.checkSpaceAccess(req, spaceId)

    const users = await this.userService.getUsersBySpaceId(spaceId)
    res.send(this.responseData(users))
  }

  async remove(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    const userId = Number(req.params.userId)

    this.checkSpaceAccess(req, spaceId)

    const result = await this.spaceFacade.removeUserFromSpace(userId, spaceId)
    res.send(this.responseData(result))
  }
}
