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

  async getActivitiesBySpace(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    this.checkSpaceAccess(req, spaceId)

    const type = req.query?.type ? String(req.query?.type) : null
    const action = req.query?.action ? String(req.query?.action) : null

    const activities = await this.activityService.getBySpaceId(spaceId, type, action)
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
