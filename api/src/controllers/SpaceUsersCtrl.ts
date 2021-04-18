import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { UserService, UserSpaceService } from '../services'
import { SpaceFacade } from '../services/facade'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { validateSpaceUserUpdate, SpaceUserUpdateValue } from '../services/user-space'

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
    const result = await this.userSpaceService.requireByUserIdAndSpaceId(req.user.id, spaceId, { active: true })

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

    await validateSpaceUserUpdate(req.body.data)
    const value = SpaceUserUpdateValue.fromObject(req.body.data)

    const result = await this.spaceFacade.updateSpaceUser(value, userId, spaceId)
    res.send(this.responseData(result))
  }

  async remove(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    const userId = Number(req.params.userId)

    this.isSpaceAdmin(req, spaceId)

    const result = await this.spaceFacade.removeSpaceUser(userId, spaceId)
    res.send(this.responseData(result))
  }
}
