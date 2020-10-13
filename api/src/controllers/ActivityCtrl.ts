import e, { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { ActivityService, EntityService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class ActivityCtrl extends BaseCtrl {
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
    this.checkSpaceAccess(req, entity.spaceId)

    const result = await this.activityService.getByEntity(entityName, entityId)
    res.send(this.responseData(result))
  }

  checkSpaceAccess(req: Request, spaceId: number) {
    const user = req.user as any

    if (!user.userSpaceIds.includes(spaceId)) {
      throw new Error('Access to space is not allowed')
    }
  }
}
