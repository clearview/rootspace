import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'
import { UpdateResult } from 'typeorm/index'

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

  async getUnreadUserNotificationsForEntity(userId: number, entity: string, entityId: number): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .andWhere('activity.entityId = :entityId', { entityId })
      .andWhere('activity.entity = :entity', { entity })
      .getMany()
  }

  getUserNotifications(id: number, spaceId?: number, read?: string): Promise<Notification[]> {
    const queryBuilder = this.createQueryBuilder('notification')
      .where('notification.userId = :id', { id })

    if (spaceId) {
      queryBuilder.andWhere(`notification.spaceId = :spaceId`, { spaceId })
    }

    switch (read) {
      case 'read':
      case 'unread':
        queryBuilder.andWhere(`notification.isRead = :read`, { read: read === 'read' })
        break
    }

    return queryBuilder.getMany()
  }

  async getUserNotificationsForEntity(userId: number, entityId: number, tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.activity', 'activity')
      .where('notification.userId = :userId', { userId })
      .andWhere('activity.entityId = :entityId', { entityId })
      .andWhere('activity.tableName = :tableName', { tableName })
      .getMany()
  }

  async read(ids: number[], userId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .whereInIds(ids)
      .andWhere('userId = :userId', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute()
  }
}
