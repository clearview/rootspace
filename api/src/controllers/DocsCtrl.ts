import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { DocService } from '../services/DocService'
import { DocRepository } from '../repositories/DocRepository'
import { validateDocCreate } from '../validation/doc'

export class DocsCtrl extends BaseCtrl {
  private docService: DocService

  constructor() {
    super()
    this.docService = new DocService()
  }

  public async view(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).findOne(
      Number(req.params.id)
    )
    res.send(doc)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      await validateDocCreate(data)

      const doc = await this.docService.create(data, req.user.id)
      res.send(doc)
    } catch (err) {
      next(err)
    }
  }

  public async update(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).update(
      Number(req.params.id),
      req.body
    )
    return this.view(req, res)
  }

  public async delete(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).delete({
      id: Number(req.params.id),
    })
    res.send({ deleted: true })
  }
}
