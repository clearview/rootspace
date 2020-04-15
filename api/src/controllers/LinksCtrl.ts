import { Request, Response } from 'express'
import { getCustomRepository, getTreeRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'

export class LinksCtrl extends BaseCtrl {

  public async view(req: Request, res: Response) {
    const space = await getCustomRepository(LinkRepository).findOne(Number(req.params.id))
    res.send(space)
  }

  public async listAll(req: Request, res: Response) {
    const spaces = await getTreeRepository(Link).findTrees()
    res.send(spaces)
  }

  public async create(req: Request, res: Response) {
    const validData: object = {
      userId: req.user.id
    }
    const data = Object.assign(req.body, validData)

    if (data.parent) {
      const parent = await getCustomRepository(LinkRepository).findOne(Number(data.parent))
      data.parent = parent
    }

    const space =  getCustomRepository(LinkRepository).create(data)
    const newSpace = await getCustomRepository(LinkRepository).save(space)
    res.send(newSpace)
  }

  public async update(req: Request, res: Response) {
    const space = await getCustomRepository(LinkRepository).update(
      Number(req.params.id),
      req.body
    )
    return this.view(req, res)
  }

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(LinkRepository).delete({ id: Number(req.params.id) })
    res.send({ deleted: true })
  }
}