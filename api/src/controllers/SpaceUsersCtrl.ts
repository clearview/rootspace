import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { SpaceService, UserService, UserSpaceService } from '../services'
import { SpaceFacade } from '../services/facade'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { SpaceUserUpdateValue } from '../values/spaceUser'
import { validateSpaceUserUpdate } from '../validation/spaceUser'

export class SpaceUsersCtrl extends BaseCtrl {
  private spaceFacade: SpaceFacade
  private userService: UserService
  private userSpaceService: UserSpaceService

  constructor() {
    super()
    this.spaceFacade = new SpaceFacade()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.userSpaceService = ServiceFactory.getInstance().getUserSpaceService()
  }

  async listAll(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    this.isSpaceMember(req, spaceId)

    const users = await this.userService.getUsersBySpaceId(spaceId)
    res.send(this.responseData(users))
  }

  async whoami(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    const result = await this.userSpaceService.requireByUserIdAndSpaceId(req.user.id, spaceId)

    res.send(this.responseData(result))
  }

  async view(req: Request, res: Response) {
    const userId = Number(req.params.userId)
    const spaceId = Number(req.params.spaceId)

    const result = await this.userSpaceService.requireByUserIdAndSpaceId(userId, spaceId)
    res.send(this.responseData(result))
  }

  async update(req: Request, res: Response) {
    const userId = Number(req.params.userId)
    const spaceId = Number(req.params.spaceId)

    this.isSpaceAdmin(req, spaceId)
    
    const data = req.body.data
    await validateSpaceUserUpdate(data)

    const value = SpaceUserUpdateValue.fromObject(data)
    const resutl = await this.userSpaceService.update(value, userId, spaceId)

    res.send(this.responseData(resutl))
  }

  async remove(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    const userId = Number(req.params.userId)

    this.isSpaceAdmin(req, spaceId)

    const result = await this.spaceFacade.removeUserFromSpace(userId, spaceId)
    res.send(this.responseData(result))
  }
}
