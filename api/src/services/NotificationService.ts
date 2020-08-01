import { getCustomRepository } from 'typeorm'
import { NotificationRepository } from '../database/repositories/NotificationRepository'
import { Notification } from '../database/entities/Notification'
import { Follow } from '../database/entities/Follow'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { ActivityEvent } from './events/ActivityEvent'

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

  getNotificationById(id: number): Promise<Notification | undefined> {
    return this.getNotificationRepository().findOne(id)
  }

  getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return this.getNotificationRepository().find({ id: userId })
  }

  async create(activity: ActivityEvent): Promise<Notification> {
    if (!activity.userId) {
      throw new Error('Notification require userId')
    }

    const notification = this.getNotificationRepository().create()
    notification.userId = activity.userId
    notification.actorId = activity.actorId
    notification.entityId = activity.entityId
    notification.entity = activity.entity
    notification.tableName = activity.tableName
    notification.action = activity.action

    return this.getNotificationRepository().save(notification)
  }

  save(notifications: Notification[]): Promise<Notification[]> {
    return this.getNotificationRepository().save(notifications)
  }

  async getExistingNotification(activity: ActivityEvent, follow: Follow): Promise<Notification | undefined> {
    return this.getNotificationRepository().findOne({
      userId: follow.userId,
      actorId: activity.actorId,
      entityId: activity.entityId,
      entity: activity.entity,
      tableName: activity.tableName,
      isRead: false
    })
  }

  async removeNotificationsForTasks(taskIds: number[]): Promise<void> {
    const notifications = await this.getNotificationRepository().getNotificationsForItems(taskIds, 'tasks')
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async removeUserNotificationsForItem(userId: number, entityId: number, tableName: string): Promise<void> {
    const notifications = await this.getNotificationRepository().getUserNotificationsForItem(userId, entityId, tableName)
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async deleteFromActivity(activity: ActivityEvent): Promise<DeleteResult> {
    return this.getNotificationRepository().delete({
      entityId: activity.entityId,
      tableName: activity.tableName
    })
  }

  async delete(criteria: any): Promise<DeleteResult> {
    return this.getNotificationRepository().delete(criteria)
  }
}
