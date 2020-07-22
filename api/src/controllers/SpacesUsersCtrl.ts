import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { UserService } from '../services'
import { clientError } from '../errors'
import { SpaceFacade } from '../services/facade'

export class SpacesUsersCtrl extends BaseCtrl {
  private userService: UserService
  private spaceFacade: SpaceFacade

  constructor() {
    super()
    this.userService = UserService.getInstance()
    this.spaceFacade = new SpaceFacade()
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const spaceId = req.params.spaceId

      if (!spaceId) {
        throw clientError('Invalid request')
      }

      const users = await this.userService.getUsersBySpaceId(Number(spaceId))
      const resData = this.responseData(users)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const spaceId = Number(req.params.spaceId)
    const userId = Number(req.params.userId)

    if (!spaceId || !userId) {
      throw clientError('Invalid request')
    }

    const result = await this.spaceFacade.removeUserFromSpace(userId, spaceId)
    res.send(this.responseData(result))
  }
}
