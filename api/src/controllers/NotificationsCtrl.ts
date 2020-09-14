import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NotificationService, UserService } from '../services'
import { ucFirst } from '../utils'

export class NotificationsCtrl extends BaseCtrl {
  protected userService: UserService
  protected notificationService: NotificationService

  constructor() {
    super()
    this.userService = UserService.getInstance()
    this.notificationService = NotificationService.getInstance()
  }

  async notifications(req: Request, res: Response) {
    const notifications = await this.notificationService.getUserNotifications(
      req.user.id,
      Number(req.params?.spaceId),
      req.params?.read ? req.params.read : 'all'
    )

    res.send(notifications)
  }

  async readForEntity(req: Request, res: Response) {
    const user = req.user
    const entity = ucFirst(req.params.entity)
    const entityId = Number(req.params.id)

    const updateResult = await this.notificationService.readUsersNotificationsForEntity(user.id, entity, entityId)

    res.send(updateResult)
  }

  async readNotification(req: Request, res: Response) {
    const notificationId = Number(req.params?.id)
    const readNotification = await this.notificationService.readUserNotification(notificationId, req.user.id)

    res.send(readNotification)
  }

  async readNotifications(req: Request, res: Response) {
    const notificationIds = req.body
    const updateResult = await this.notificationService.readUsersNotificationsForEntityIds(notificationIds, req.user.id)

    res.send(updateResult)
  }
}