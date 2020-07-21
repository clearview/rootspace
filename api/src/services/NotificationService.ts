import { getCustomRepository } from 'typeorm'
import { NotificationRepository } from '../database/repositories/NotificationRepository'
import { Notification } from '../database/entities/Notification'
import { IEventProvider } from './events/EventType'
import { Follow } from '../database/entities/Follow'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { EventEmitter } from 'events'

export class NotificationService {
  private static instance: NotificationService
  private emitter: EventEmitter

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
      NotificationService.instance.emitter = new EventEmitter()
    }

    return NotificationService.instance
  }

  static emitter() {
    return NotificationService.instance.emitter
  }

  static emit(eventName: string, event: IEventProvider): boolean {
    return this.getInstance().emitter.emit(eventName, event)
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

  async create(event: IEventProvider): Promise<Notification> {
    const notification = this.getNotificationRepository().create()
    notification.itemId = event.itemId
    notification.userId = event.userId
    notification.actorId = event.actorId
    notification.tableName = event.tableName
    notification.targetName = event.targetName
    notification.message = event.message
    notification.action = event.action

    return this.getNotificationRepository().save(notification)
  }

  save(notifications: Notification[]): Promise<Notification[]> {
    return this.getNotificationRepository().save(notifications)
  }

  async getExistingNotification(event: IEventProvider, follow: Follow): Promise<Notification | undefined> {
    return this.getNotificationRepository().findOne({
      itemId: event.itemId,
      userId: follow.userId,
      actorId: event.actorId,
      targetName: event.targetName,
      tableName: event.tableName,
      isRead: false
    })
  }

  async removeNotificationsForTasks(taskIds: number[]): Promise<void> {
    const notifications = await this.getNotificationRepository().getNotificationsForItems(taskIds, 'tasks')
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async removeUserNotificationsForItem(userId: number, itemId: number, tableName: string): Promise<void> {
    const notifications = await this.getNotificationRepository().getUserNotificationsForItem(userId, itemId, tableName)
    if (notifications.length > 0) {
      await this.getNotificationRepository().remove(notifications)
    }
  }

  async deleteFromEvent(event: IEventProvider): Promise<DeleteResult> {
    return this.getNotificationRepository().delete({
      itemId: event.itemId,
      tableName: event.tableName
    })
  }
}
