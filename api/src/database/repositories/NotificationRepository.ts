import { EntityRepository, UpdateResult } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'
import { Activity } from '../entities/Activity'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
  getById(id: number, filter: any = {}): Promise<Notification | undefined> {
    const queryBuilder = this.createQueryBuilder('notification').where('notification.id = :id', { id })

    if (filter.isRead) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: filter.isRead })
    }

    return queryBuilder.getOne()
  }

  async getByUserForEntity(
    userId: number,
    entity: string,
    entityId: number,
    isRead: boolean = false
  ): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .innerJoin(Activity, 'activity', 'notification.activityId = activity.id')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead })
      .andWhere('activity.entity = :entity', { entity })
      .andWhere('activity.entityId = :entityId', { entityId })
      .getMany()
  }

  async setSeenByUserForEntity(userId: number, entity: string, entityId: number): Promise<UpdateResult | null> {
    const notifications = await this.getByUserForEntity(userId, entity, entityId)
    const ids = notifications.map((notification) => notification.id)

    if (ids.length === 0) {
      return null
    }
    return this.createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .whereInIds(ids)
      .andWhere('userId = :userId', { userId })
      .execute()
  }

  setSeenByUserForSpace(userId: number, spaceId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('isRead = false')
      .andWhere('userId = :userId', { userId })
      .andWhere('spaceId = :spaceId', { spaceId })
      .execute()
  }
}
