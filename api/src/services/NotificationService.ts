import { getCustomRepository } from 'typeorm'
import { NotificationRepository } from '../repositories/NotificationRepository'
import { Notification } from '../database/entities/Notification'
import { IEventProvider } from '../types/event'
import { Follow } from '../database/entities/Follow'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'

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

  create(event: IEventProvider): Notification {
    const notification = this.getNotificationRepository().create()
    notification.itemId = event.id
    notification.tableName = event.tableName

    return notification
  }

  async getExistingNotification(event: IEventProvider, follow: Follow) {
    return this.getNotificationRepository().findOne({
      userId: follow.userId,
      itemId: event.id,
      tableName: event.tableName,
      isRead: false
    })
  }

  async delete(event: IEventProvider): Promise<DeleteResult> {
    return this.getNotificationRepository().delete({
      itemId: event.id,
      tableName: event.tableName
    })
  }
}
