import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { SpaceCreateValue, SpaceUpdateValue } from '../values/space'
import { validateSpaceCreate, validateSpaceUpdate } from '../validation/space'
import { SpaceService, InviteService } from '../services'

export class SpacesCtrl extends BaseCtrl {
  private spaceService: SpaceService
  private inviteService: InviteService

  constructor() {
    super()
    this.spaceService = SpaceService.getInstance()
    this.inviteService = InviteService.getInstance()
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
    try {
      await validateSpaceCreate(req.body)

      const data = SpaceCreateValue.fromObjectAndUserId(req.body, req.user.id)
      const space = await this.spaceService.create(data)

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
      const space = await this.spaceService.update(data, id)

      res.send(space)
    } catch (err) {
      next(err)
    }
  }

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).delete({
      id: Number(req.params.id),
      userId: req.user.id,
    })
    res.send({ deleted: true })
  }
}
