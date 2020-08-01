import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { getConnection } from 'typeorm/index'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
  async getNotificationsForItems(entityIds: number[], tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .where('notification.entityId IN (:...entityIds)', { entityIds })
      .andWhere('notification.tableName = :tableName', { tableName })
      .getMany()
  }

  async getUserNotificationsForItem(userId: number, entityId: number, tableName: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.entityId = :entityId', { entityId })
      .andWhere('notification.tableName = :tableName', { tableName })
      .getMany()
  }

  async getOneFromActivity(activity: ActivityEvent): Promise<any> {
    return getConnection()
      .getRepository(activity.entity)
      .createQueryBuilder('Entity')
      .where('Entity.id = :id', {id: activity.entityId})
      .getOne()
  }
}
