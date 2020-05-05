import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateDocCreate, validateDocUpdate } from '../validation/doc'
import { DocCreateValue } from '../values/doc/DocCreateValue'
import { DocUpdateValue } from '../values/doc/DocUpdateValue'
import { DocService } from '../services/entities/DocService'
import { clientError } from '../errors/httpError'
import { ClientErrName, ClientStatusCode } from '../errors/httpErrorProperty'

export class DocsCtrl extends BaseCtrl {
  private docService: DocService

  constructor() {
    super()
    this.docService = new DocService()
  }

  async view(req: Request, res: Response, next: NextFunction) {
    const doc = await this.docService.getDocById(Number(req.params.id))

    if (!doc) {
      return next(
        clientError(
          'Document not found',
          ClientErrName.EntityNotFound,
          ClientStatusCode.NotFound
        )
      )
    }

    const content = this.responseContent(doc)
    res.send(content)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateDocCreate(data)

      const value = DocCreateValue.fromObjectAndUserId(
        data,
        Number(req.user.id)
      )

      const doc = await this.docService.create(value)
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

      await validateDocUpdate(data)

      const value = DocUpdateValue.fromObject(data)
      const result = await this.docService.update(value, id)

      res.send({ updated: result })
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response) {
    const result = await this.docService.delete(Number(req.params.id))
    res.send(result)
  }
}
