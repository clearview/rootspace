import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { SpaceRepository } from '../repositories/SpaceRepository'

export class SpacesCtrl extends BaseCtrl {

  public async view(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).findOne(Number(req.params.id))
    res.send(space)
  }

  public async listAll(req: Request, res: Response) {
    const spaces = await getCustomRepository(SpaceRepository).find()
    res.send(spaces)
  }

  public async create(req: Request, res: Response) {
    const data: object = {
      title: req.body.title,
      userId: req.user.id
    }
    const space =  getCustomRepository(SpaceRepository).create(data)
    const newSpace = await getCustomRepository(SpaceRepository).save(space)
    res.send(newSpace)
  }

  public async update(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).update(
      Number(req.params.id),
      req.body
    )
    return this.view(req, res)
  }

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).delete({ id: Number(req.params.id) })
    res.send({ deleted: true })
  }
}