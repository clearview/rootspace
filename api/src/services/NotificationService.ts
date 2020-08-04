import { getCustomRepository } from 'typeorm'
import { NotificationRepository } from '../database/repositories/NotificationRepository'
import { Notification } from '../database/entities/Notification'
import { Follow } from '../database/entities/Follow'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { ActivityEvent } from './events/ActivityEvent'
import { ActivityService } from './ActivityService'

export class NotificationService {
  private static instance: NotificationService
  private activityService: ActivityService

  private constructor() {
    this.activityService = ActivityService.getInstance()
  }

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }

    return NotificationService.instance
  }

  getNotificationRepository(): NotificationRepository {
    return getCustomRepository(NotificationRepository)
  }

  getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return this.getNotificationRepository().find({ id: userId })
  }

  async create(event: ActivityEvent): Promise<Notification> {
    if (!event.userId) {
      throw new Error('Notification require userId')
    }

    if (!event.activity?.id) {
      throw new Error('Notification require activityId')
    }

    const notification = this.getNotificationRepository().create()
    notification.userId = event.userId
    notification.spaceId = event.spaceId
    notification.activityId = event.activity.id

    return this.getNotificationRepository().save(notification)
  }

  save(notifications: Notification[]): Promise<Notification[]> {
    return this.getNotificationRepository().save(notifications)
  }

  async getUnreadNotification(event: ActivityEvent, follow: Follow): Promise<Notification> {
    return this.getNotificationRepository().getUnreadUserNotificationForEntity(
      follow.userId,
      event.activity.id,
      event.activity.entity
    )
  }

  async removeNotificationsForTasks(taskIds: number[]): Promise<void> {
    const notifications = await this.getNotificationRepository().getNotificationsForEntities(taskIds, 'tasks')
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async removeUserNotificationsForItem(userId: number, entityId: number, tableName: string): Promise<void> {
    const notifications = await this.getNotificationRepository().getUserNotificationsForEntity(userId, entityId, tableName)
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async delete(criteria: any): Promise<DeleteResult> {
    return this.getNotificationRepository().delete(criteria)
  }
}
