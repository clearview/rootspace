import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NotificationService, UserService } from '../services'

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

  async read(req: Request, res: Response) {
    const notificationId = Number(req.params?.id)
    const notification = await this.notificationService.readUserNotification(notificationId, req.user.id)

    res.send(notification)
  }

  async readForEntity(req: Request, res: Response) {
    const notificationIds = req.body
    const updateResult = this.notificationService.readUsersNotificationsForEntityIds(notificationIds, req.user.id)

    res.send(updateResult)
  }
}
