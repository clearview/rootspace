import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { SpaceService } from '../services/SpaceService'
import { InviteService } from '../services/InviteService'
import { UserService } from '../services/UserService'
import { ISpaceProvider } from '../types/space'
import { SpaceValidator } from '../validation/space/SpaceValidator'
import { Space } from '../entities/Space'
import { clientError } from '../errors/httpError'
import { User } from '../entities/User'

export class SpacesCtrl extends BaseCtrl {
  private spaceService: SpaceService
  private userService: UserService
  private inviteService: InviteService

  constructor() {
    super()
    this.spaceService = new SpaceService()
    this.userService = new UserService()
    this.inviteService = new InviteService()
  }

  public async view(req: Request, res: Response) {
    if (req.params.id === 'my') {
      return this.my(req, res)
    }
    const space = await getCustomRepository(SpaceRepository).findOne({
      id: Number(req.params.id),
      userId: req.user.id,
    })
    res.send(space)
  }

  public async my(req: Request, res: Response) {
    const spaces = await getCustomRepository(SpaceRepository).getByUserId(
      req.user.id
    )
    res.send(spaces)
  }

  public async listAll(req: Request, res: Response) {
    const spaces = await getCustomRepository(SpaceRepository).find({
      userId: req.user.id,
    })
    res.send(spaces)
  }

  async users(req: Request, res: Response, next: NextFunction) {
    try {
      const spacedId = req.params.id

      if (!spacedId) {
        throw clientError('Invalid request')
      }

      const users = await this.userService.getUsersBySpaceId(Number(spacedId))
      const resData = this.responseData(users)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    let space: Space

    try {
      const data: ISpaceProvider = {
        title: req.body.title,
        userId: req.user.id,
      }

      const validator = new SpaceValidator()
      await validator.validate(data)

      space = await this.spaceService.create(data)
      res.send(space)
    } catch (err) {
      next(err)
    }

    if (req.body.invites) {
      this.inviteService.createfromArray(req.body.invites, space)
    }
  }

  public async update(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).update(
      {
        id: Number(req.params.id),
        userId: req.user.id,
      },
      req.body
    )
    return this.view(req, res)
  }

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).delete({
      id: Number(req.params.id),
      userId: req.user.id,
    })
    res.send({ deleted: true })
  }
}
