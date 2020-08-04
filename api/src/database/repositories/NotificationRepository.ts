import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { getConnection } from 'typeorm/index'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
  async getNotificationsForEntities(entityIds: number[], tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('activity.entityId IN (:...entityIds)', { entityIds })
      .andWhere('activity.tableName = :tableName', { tableName })
      .getMany()
  }

  async getUnreadUserNotificationForEntity(userId: number, entityId: number, tableName: string): Promise<Notification> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .andWhere('activity.entityId = :entityId', { entityId })
      .andWhere('activity.tableName = :tableName', { tableName })
      .getOne()
  }

  async getUserNotificationsForEntity(userId: number, entityId: number, tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('notification.userId = :userId', { userId })
      .andWhere('activity.entityId = :entityId', { entityId })
      .andWhere('activity.tableName = :tableName', { tableName })
      .getMany()
  }
}
