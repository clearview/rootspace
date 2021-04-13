import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateContentAccessUpdate } from '../services/content-access'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'
import { ContentAccessUpdateValue } from '../services/content-access'
import { EntityService, ContentAccessService } from '../services'
import { ContentEntity } from '../root/types'

export class ContentAccessCtrl extends BaseCtrl {
  private contentAccessService: ContentAccessService
  private entityService: EntityService

  constructor() {
    super()
    this.contentAccessService = ServiceFactory.getInstance().getContentAccessService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
  }

  async view(req: Request, res: Response) {
    const entityId = Number(req.params.entityId)
    const entityName = req.params.entity

    const entity = await this.entityService.requireEntityByNameAndId<ContentEntity>(entityName, entityId)
    this.isSpaceMember(req, entity.spaceId)

    const result = await this.contentAccessService.getForEntity(entity)
    res.send(this.responseData(result))
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    await validateContentAccessUpdate(data)

    const entityId = Number(req.params.entityId)
    const entityName = req.params.entity

    const entity = await this.entityService.requireEntityByNameAndId<ContentEntity>(entityName, entityId)
    this.isSpaceMember(req, entity.spaceId)

    const contentAccess = await this.contentAccessService.getForEntity(entity)

    if (contentAccess.ownerId !== req.user.id) {
      throw clientError('Not allowed', HttpErrName.Forbidden, HttpStatusCode.Forbidden)
    }

    const value = ContentAccessUpdateValue.fromObject(data)
    const result = await this.contentAccessService.update(value, contentAccess.id)

    res.send(this.responseData(result))
  }
}
