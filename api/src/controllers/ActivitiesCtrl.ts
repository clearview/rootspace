import e, { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { ActivityService, EntityService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { HttpErrName, HttpStatusCode, clientError } from '../errors'

export class ActivitiesCtrl extends BaseCtrl {
  private activityService: ActivityService
  private entityService: EntityService

  constructor() {
    super()
    this.activityService = ServiceFactory.getInstance().getActivityService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
  }

  async getForSpace(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    this.checkSpaceAccess(req, spaceId)

    const filter: any = {}

    if (req.query.action) {
      filter.action = req.query.action
    }

    if (req.query.type) {
      filter.type = req.query.type
    }

    const activities = await this.activityService.getBySpaceId(spaceId, filter)
    const resData = this.responseData(activities)

    res.send(resData)
  }

  async getForEntity(req: Request, res: Response) {
    const entityName = req.params.entity
    const entityId = Number(req.params.entityId)

    const entity = await this.entityService.requireEntityByNameAndId<any>(entityName, entityId)

    if (this.checkSpaceAccess(req, entity.spaceId, false) === false) {
      throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    const result = await this.activityService.getByEntity(entityName, entityId)
    res.send(this.responseData(result))
  }
}
