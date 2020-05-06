import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateDocCreate, validateDocUpdate } from '../validation/doc'
import { DocCreateValue, DocUpdateValue } from '../values/doc'
import { DocService } from '../services/entities/DocService'
import { clientError } from '../errors/httpError'
import { ClientErrName, ClientStatusCode } from '../errors/httpErrorProperty'
import { ContentManager } from '../services/ContentManager'

export class DocsCtrl extends BaseCtrl {
  private docService: DocService
  private contentManager: ContentManager

  constructor() {
    super()
    this.docService = DocService.getInstance()
    this.contentManager = ContentManager.getInstance()
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

    const resData = this.responseData(doc)
    res.send(resData)
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
      const resData = this.responseData(doc)

      const link = await this.contentManager.getDocLink(doc)
      
      resData.includes(link, 'link')

      res.send(resData)
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
