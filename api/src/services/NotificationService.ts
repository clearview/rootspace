import { getCustomRepository, UpdateResult } from 'typeorm'
import { Notification } from '../database/entities/Notification'
import { Activity } from '../database/entities/Activity'
import { NotificationRepository } from '../database/repositories/NotificationRepository'
import { HttpErrName, HttpStatusCode, clientError } from '../errors'

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

  getById(id: number, filter = {}): Promise<Notification> {
    return this.getNotificationRepository().getById(id, filter)
  }

  async requireById(id: number, filter = {}): Promise<Notification> {
    const notification = await this.getById(id, filter)

    if (!notification) {
      throw clientError('Notification not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return this.getNotificationRepository().findOne(id)
  }

  async create(activity: Activity, userId: number): Promise<Notification> {
    const notification = new Notification()

    notification.userId = userId
    notification.spaceId = activity.spaceId
    notification.activityId = activity.id

    return this.getNotificationRepository().save(notification)
  }

  async seen(id: number, userId: number): Promise<Notification> {
    const notification = await this.requireById(id)

    if (notification.userId !== userId) {
      throw clientError('Notification not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    notification.isRead = true
    return this.getNotificationRepository().save(notification)
  }

  seenForEntity(userId: number, entity: string, entityId: number): Promise<UpdateResult> {
    return this.getNotificationRepository().setSeenByUserForEntity(userId, entity, entityId)
  }

  seenForSpace(userId: number, spaceId: number) {
    return this.getNotificationRepository().setSeenByUserForSpace(userId, spaceId)
  }
}
