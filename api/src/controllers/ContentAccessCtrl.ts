import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { ContentAccessService, validateContentAccessUpdate } from '../services/content-access'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'
import { ContentAccessUpdateValue } from '../services/content-access'

export class ContentAccessCtrl extends BaseCtrl {
  protected contentAccessService: ContentAccessService

  constructor() {
    super()
    this.contentAccessService = ServiceFactory.getInstance().getContentAccessService()
  }

  async view(req: Request, res: Response) {
    const entityId = Number(req.params.entityId)
    const entity = req.params.entity

    const result = await this.contentAccessService.getForEntity(entityId, entity)
    res.send(this.responseData(result))
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    await validateContentAccessUpdate(data)

    const entityId = Number(req.params.entityId)
    const entity = req.params.entity

    const contentAccess = await this.contentAccessService.getForEntity(entityId, entity)

    if (contentAccess.ownerId !== req.user.id) {
      throw clientError('Not allowed', HttpErrName.Forbidden, HttpStatusCode.Forbidden)
    }

    const value = ContentAccessUpdateValue.fromObject(data)
    const result = await this.contentAccessService.update(value, contentAccess.id)

    res.send(this.responseData(result))
  }
}
