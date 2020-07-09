import { getConnection, getCustomRepository } from 'typeorm'
import { SubscriptionRepository } from '../../repositories/SubscriptionRepository'
import { Subscription } from '../../database/entities/Subscription'
import { User } from '../../database/entities/User'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { IEventProvider } from '../../types/event'
import { NotificationService } from '../NotificationService'

export class SubscriptionService {
  private static instance: SubscriptionService
  private notificationService: NotificationService

  private constructor() {
    this.notificationService = NotificationService.getInstance()
  }

  static getInstance() {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService()
    }

    return SubscriptionService.instance
  }

  getSubscriptionRepository(): SubscriptionRepository {
    return getCustomRepository(SubscriptionRepository)
  }

  async getById(id: number): Promise<Subscription> {
    return this.getSubscriptionRepository().findOneOrFail(id)
  }

  async getSubscriptions(event: IEventProvider): Promise<Subscription[]> {
    return this.getSubscriptionRepository().find({
      itemId: event.id,
      tableName: event.tableName
    })
  }

  async subscribe(user: User, item: any): Promise<Subscription> {
    const existingSubscription = await this.getSubscriptionRepository().findOne({
      userId: user.id,
      itemId: item.id
    })

    if (existingSubscription) {
      return existingSubscription
    }

    const subscription = new Subscription()
    subscription.user = user
    subscription.itemId = item.id
    subscription.tableName = getConnection().getMetadata(item.constructor.name).tableName

    await this.getSubscriptionRepository().save(subscription)

    return this.getSubscriptionRepository().reload(subscription)
  }

  async unsubscribe(user: User, entity: any): Promise<DeleteResult> {
    const existingSubscription = await this.getSubscriptionRepository().findOne({
      userId: user.id,
      itemId: entity.id
    })

    if (existingSubscription) {
      await this.removeAllNotificationsFromEntity(entity)
      return this.getSubscriptionRepository().delete(existingSubscription.id)
    }
  }

  async removeAllFromEntity(entity: any): Promise<DeleteResult> {
    const itemId = entity.id
    const tableName = getConnection().getMetadata(entity.constructor.name).tableName

    const existingSubscriptions = await this.getSubscriptionRepository().find({ itemId, tableName })

    if (!existingSubscriptions) {
      return
    }

    const subscriptionIds = existingSubscriptions.map((subscription) => { return subscription.id })

    if (subscriptionIds.length > 0) {
      await this.removeAllNotificationsFromEntity(entity)
      return this.getSubscriptionRepository().delete(subscriptionIds)
    }
  }

  async removeAllNotificationsFromEntity(entity: any): Promise<DeleteResult> {
    return this.notificationService.delete({
      id: entity.id,
      tableName: getConnection().getMetadata(entity.constructor.name).tableName
    })
  }

  async createNotifications(event: IEventProvider): Promise<Subscription[]> {
    const subscriptions = await this.getSubscriptions(event)

    const notifications = []

    for (const subscription of subscriptions) {
      const existingNotification = await this.notificationService.getExistingNotification(event, subscription)
      if (existingNotification) { break }

      const notification = this.notificationService.create(event)
      notification.userId = subscription.userId

      notifications.push(notification)
    }

    return this.notificationService.getNotificationRepository().save(notifications)
  }

  async removeAllFromEvent(event: IEventProvider): Promise<DeleteResult> {
    const itemId = event.id
    const tableName = event.tableName

    const existingSubscriptions = await this.getSubscriptionRepository().find({ itemId, tableName })

    if (!existingSubscriptions) {
      return
    }

    const subscriptionIds = existingSubscriptions.map((subscription) => { return subscription.id })

    if (subscriptionIds.length > 0) {
      await this.removeAllNotificationsFromEvent(event)
      return this.getSubscriptionRepository().delete(subscriptionIds)
    }
  }

  async removeAllNotificationsFromEvent(event: IEventProvider): Promise<DeleteResult> {
    return this.notificationService.delete({
      id: event.id,
      tableName: event.tableName
    })
  }

}
