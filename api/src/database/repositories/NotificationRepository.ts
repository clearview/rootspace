import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
  async getNotificationsForEntities(entityIds: number[], entity: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('activity.entityId IN (:...entityIds)', { entityIds })
      .andWhere('activity.entity = :entity', { entity })
      .getMany()
  }

  async getUnreadUserNotificationForEntity(userId: number, entityId: number, entity: string): Promise<Notification> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .andWhere('activity.entityId = :entityId', { entityId })
      .andWhere('activity.entity = :entity', { entity })
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
