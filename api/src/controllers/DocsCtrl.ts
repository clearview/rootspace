import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import { DocRepository } from '../repositories/DocRepository'
import { DocService } from '../services/DocService'
import { validateDocCreate, validateDocUpdate } from '../validation/doc'

export class DocsCtrl extends BaseCtrl {
  private docService: DocService

  constructor() {
    super()
    this.docService = new DocService()
  }

  async view(req: Request, res: Response) {
    const doc = await this.docService.getDocById(Number(req.params.id))
    const content = this.responseContent(doc)

    res.send(content)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateDocCreate(data)

      const doc = await this.docService.create(data, req.user.id)
      const content = this.responseContent(doc)

      res.send(content)
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = req.body.data

      await validateDocUpdate(req.body.data)

      const updateResult = await this.docService.update(data, id)
      res.send(updateResult)
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response) {
    const doc = await getCustomRepository(DocRepository).delete({
      id: Number(req.params.id),
    })
    res.send({ deleted: true })
  }
}
