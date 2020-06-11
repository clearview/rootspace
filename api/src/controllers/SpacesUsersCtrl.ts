import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { UserService, UserSpaceService, SpaceService } from '../services'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'

export class SpacesUsersCtrl extends BaseCtrl {
  private userService: UserService
  private userSpaceService: UserSpaceService
  private spaceService: SpaceService

  constructor() {
    super()
    this.userService = UserService.getInstance()
    this.userSpaceService = UserSpaceService.getInstance()
    this.spaceService = SpaceService.getInstance()
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
    try {
      const spaceId = Number(req.params.spaceId)
      const userId = Number(req.params.userId)

      if (!spaceId || !userId) {
        throw clientError('Invalid request')
      }

      const space = await this.spaceService.getSpaceById(spaceId)

      if (userId === space.userId) {
        throw clientError(
          'Can not remove space owner from space',
          HttpErrName.InvalidRequest,
          HttpStatusCode.NotAllowed
        )
      }

      const result = await this.userSpaceService.remove(userId, spaceId)
      const resData = this.responseData(result)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }
}
