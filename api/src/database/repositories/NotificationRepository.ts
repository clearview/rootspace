import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
  async getNotificationsForItems(itemIds: number[], tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .where('notification.itemId IN (:...itemIds)', { itemIds })
      .andWhere('notification.tableName = :tableName', { tableName })
      .getMany()
  }

  async getUserNotificationsForItem(userId: number, itemId: number, tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.itemId = :itemId', { itemId })
      .andWhere('notification.tableName = :tableName', { tableName })
      .getMany()
  }
}
