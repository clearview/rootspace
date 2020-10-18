import { getCustomRepository, DeleteResult, UpdateResult } from 'typeorm'
import { NotificationRepository } from '../database/repositories/NotificationRepository'
import { Notification } from '../database/entities/Notification'
import { Activity } from '../database/entities/Activity'

export class NotificationService {
  private static instance: NotificationService

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }

    return NotificationService.instance
  }

  getNotificationRepository(): NotificationRepository {
    return getCustomRepository(NotificationRepository)
  }

  getById(id: number): Promise<Notification> {
    return this.getNotificationRepository().findOne(id)
  }

  getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return this.getNotificationRepository().find({ id: userId })
  }

  async create(activity: Activity, userId: number): Promise<Notification> {
    const notification = new Notification()
    notification.userId = userId
    notification.spaceId = activity.spaceId
    notification.activityId = activity.id

    return this.getNotificationRepository().save(notification)
  }

  save(notification: Notification): Promise<Notification> {
    return this.getNotificationRepository().save(notification)
  }

  async getUnreadNotification(userId: number, activity: Activity): Promise<Notification> {
    return this.getNotificationRepository().getUnreadUserNotificationForEntity(
      userId,
      activity.entityId,
      activity.entity
    )
  }

  getUserNotifications(id: number, spaceId?: number, read?: string): Promise<Notification[]> {
    return this.getNotificationRepository().getUserNotifications(id, spaceId, read)
  }

  async readUserNotification(id: number, userId: number): Promise<Notification> {
    const notification = await this.getNotificationRepository().findOne({ id, userId, isRead: false })

    if (!notification) {
      throw new Error('Notification does not exist')
    }

    notification.isRead = true

    return this.getNotificationRepository().save(notification)
  }

  async readUsersNotificationsForEntity(userId: number, entityName: string, entityId: number): Promise<UpdateResult> {
    const unreadNotifications = await this.getNotificationRepository().getUnreadUserNotificationsForEntity(
      userId,
      entityName,
      entityId
    )

    if (unreadNotifications.length > 0) {
      const ids = unreadNotifications.map((notification) => notification.id)
      return this.readUsersNotificationsForEntityIds(ids, userId)
    }
  }

  async readUsersNotificationsForEntityIds(ids: number[], userId: number): Promise<UpdateResult> {
    return this.getNotificationRepository().read(ids, userId)
  }

  async removeUserNotificationsForItem(userId: number, entityId: number, tableName: string): Promise<void> {
    const notifications = await this.getNotificationRepository().getUserNotificationsForEntity(
      userId,
      entityId,
      tableName
    )
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async delete(criteria: any): Promise<DeleteResult> {
    return this.getNotificationRepository().delete(criteria)
  }
}
