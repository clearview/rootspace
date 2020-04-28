import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { DocRepository } from '../repositories/DocRepository'

export class DocsCtrl extends BaseCtrl {

  public async view(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).findOne(Number(req.params.id))
    res.send(doc)
  }

  public async create(req: Request, res: Response) {
    const validData: object = {
      userId: req.user.id
    }
    const data = Object.assign(req.body, validData)
    const doc = await getCustomRepository(DocRepository).create(data)
    res.send(doc)
  }

  public async update(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).update(
      Number(req.params.id),
      req.body
    )
    return this.view(req, res)
  }

  public async delete(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).delete({ id: Number(req.params.id) })
    res.send({ deleted: true })
  }
}