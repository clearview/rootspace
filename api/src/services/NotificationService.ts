import { getCustomRepository } from 'typeorm'
import { NotificationRepository } from '../database/repositories/NotificationRepository'
import { Notification } from '../database/entities/Notification'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { ActivityEvent } from './events/ActivityEvent'

import { UpdateResult } from 'typeorm/index'
import { ActivityService, EntityService } from './'
import { ServiceFactory } from './factory/ServiceFactory'
import { Activity } from '../database/entities/Activity'

export class NotificationService {
  private entityService: EntityService

  private static instance: NotificationService

  private constructor() {
    this.entityService = ServiceFactory.getInstance().getEntityService()
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

  getById(id: number): Promise<Notification> {
    return this.getNotificationRepository().findOne(id)
  }

  getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return this.getNotificationRepository().find({ id: userId })
  }

  async create(event: ActivityEvent | Activity, userId?: number): Promise<Notification> {
    const activity = await this.entityService.getEntityByNameAndId<Activity>(event.entity, event.entityId)

    console.log('create notification')
    const notification = new Notification()
    notification.userId = userId
    notification.spaceId = event.spaceId
    notification.activityId = event.activity.id

    console.log(notification)

    return this.getNotificationRepository().save(notification)
  }

  save(notification: Notification): Promise<Notification> {
    return this.getNotificationRepository().save(notification)
  }

  async getUnreadNotification(userId: number, event: ActivityEvent | Activity): Promise<Notification> {
    return this.getNotificationRepository().getUnreadUserNotificationForEntity(userId, event.entityId, event.entity)
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

  async removeNotificationsForTasks(taskIds: number[]): Promise<void> {
    const notifications = await this.getNotificationRepository().getNotificationsForEntities(taskIds, 'Task')
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
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
