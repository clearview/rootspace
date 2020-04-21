import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { SpaceService } from '../services/SpaceService'
import { InviteService } from '../services/InviteService'
import { ISpaceProvider } from '../types/space'
import { SpaceValidator } from '../validation/space/SpaceValidator'
import { validationFailed } from '../errors/httpError'

export class SpacesCtrl extends BaseCtrl {
  private spaceService: SpaceService
  private inviteService: InviteService

  constructor() {
    super()
    this.inviteService = new InviteService()
    this.spaceService = new SpaceService()
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
    const data: ISpaceProvider = {
      title: req.body.title,
      userId: req.user.id,
    }

    const validator = new SpaceValidator()

    try {
      await validator.validate(data)
    } catch (errors) {
      next(validationFailed('Validation failed', errors))
    }

    let space = null

    try {
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
