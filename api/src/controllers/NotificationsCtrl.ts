import { Request, Response } from 'express'
import { ucFirst } from '../utils'
import { BaseCtrl } from './BaseCtrl'
import { NotificationService, ActivityService, EntityService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { ForbiddenError } from '@casl/ability'
import { Actions } from '../middleware/AuthMiddleware'
import { Notification } from '../database/entities/Notification'

export class NotificationsCtrl extends BaseCtrl {
  private notificationService: NotificationService
  private activityService: ActivityService
  private entityService: EntityService

  constructor() {
    super()
    this.notificationService = ServiceFactory.getInstance().getNotificationService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
  }

  async getForSpace(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    this.checkSpaceAccess(req, spaceId)

    const result = await this.activityService.getUserNotifyActivities(Number(req.user.id), spaceId)
    res.send(this.responseData(result))
  }

  async seen(req: Request, res: Response) {
    const id = Number(req.params.id)
    const userId = Number(req.user.id)

    const result = await this.notificationService.seen(id, userId)
    res.send(this.responseData(result))
  }

  async seenForEntity(req: Request, res: Response) {
    const userId = Number(req.user.id)
    const entityId = Number(req.params.entityId)
    const entityName = this.entityService.convertEntityName(req.params.entity)

    const entity = await this.entityService.requireEntityByNameAndId<any>(entityName, entityId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, entity)

    const result = await this.notificationService.seenForEntity(userId, entityName, entityId)
    res.send(this.responseData(result))
  }
}
