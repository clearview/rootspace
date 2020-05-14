import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { Space } from '../entities/Space'
import { ISpaceProvider } from '../types/space'
import { SpaceValidator } from '../validation/space/SpaceValidator'
import { SpaceService, InviteService } from '../services'

export class SpacesCtrl extends BaseCtrl {
  private spaceService: SpaceService
  private inviteService: InviteService

  constructor() {
    super()
    this.spaceService = new SpaceService()
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
