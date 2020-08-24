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

  async listBySpaceId(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    const type = req.query?.type ? String(req.query?.type) : null

    const activities = await this.activityService.getBySpaceId(spaceId, type)
    const resData = this.responseData(activities)

    res.send(resData)
  }

  async listByEntityTypeAndEntityId(req: Request, res: Response) {
    const type = req.params?.entityType
    const id = Number(req.params?.entityId)

    const activities = await this.activityService.getByEntityTypeAndEntityId(type, id)
    const resData = this.responseData(activities)

    res.send(resData)
  }
}
