import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NotificationService, ActivityService, EntityService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { ForbiddenError } from '@casl/ability'
import { Actions } from '../middleware/AuthMiddleware'

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
    this.isSpaceMember(req, spaceId)

    const filter: any = {}
    const options: any = {}

    if (req.query.type) {
      filter.type = req.query.type
    }

    if (req.query.offset) {
      options.offset = req.query.offset
    }

    if (req.query.limit) {
      options.limit = req.query.limit
    }

    const result = await this.activityService.getUserNotify(Number(req.user.id), spaceId, filter, options)
    res.send(this.responseData(result))
  }

  async seen(req: Request, res: Response) {
    const userId = Number(req.user.id)

    const ids = req.params.id
      .toString()
      .split(',')
      .map((id) => {
        return Number(id)
      })

    const result = await this.notificationService.seenForIds(userId, ids)
    res.send(this.responseData(result))
  }

  async seenForEntity(req: Request, res: Response) {
    const userId = Number(req.user.id)
    const entityId = Number(req.params.entityId)
    const entityName = this.entityService.convertEntityName(req.params.entityName)

    const entity = await this.entityService.requireEntityByNameAndId<any>(entityName, entityId)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, entity)

    const result = await this.notificationService.seenForEntity(userId, entityName, entityId)
    res.send(this.responseData(result))
  }

  async seenForSpace(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)
    this.isSpaceMember(req, spaceId)

    const result = await this.notificationService.seenForSpace(Number(req.user.id), spaceId)
    res.send(this.responseData(result))
  }
}
