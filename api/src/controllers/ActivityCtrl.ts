import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { ActivityService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class ActivityCtrl extends BaseCtrl {
  private activityService: ActivityService

  constructor() {
    super()
    this.activityService = ServiceFactory.getInstance().getActivityService()
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
    const spaceId = Number(req.params?.spaceId)
    this.checkSpaceAccess(req, spaceId)

    const id = Number(req.params.entityId)
    const type = req.params.entity

    const result = await this.activityService.getAggregatedForEntity(spaceId, type, id)
    res.send(this.responseData(result))
  }

  async getRawForEntity(req: Request, res: Response) {
    const spaceId = Number(req.params?.spaceId)
    this.checkSpaceAccess(req, spaceId)

    const type = req.params?.entity
    const id = Number(req.params?.entityId)
    const action = req.query?.action ? String(req.query?.action) : null

    const activities = await this.activityService.getByEntityTypeAndEntityId(spaceId, type, id, action)
    const resData = this.responseData(activities)

    res.send(resData)
  }

  

  checkSpaceAccess(req: Request, spaceId) {
    const user = req.user as any

    if (!user.userSpaceIds.includes(spaceId)) {
      throw new Error('Access to space is not allowed')
    }
  }
}
