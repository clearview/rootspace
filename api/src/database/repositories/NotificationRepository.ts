import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
  async getNotifications(itemIds: number[], tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .where('notification.itemId IN (:...itemIds)', { itemIds })
      .andWhere('notification.tableName = :tableName', { tableName })
      .getMany()
  }
}
