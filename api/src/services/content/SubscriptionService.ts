import { getConnection, getCustomRepository } from 'typeorm'
import { SubscriptionRepository } from '../../repositories/SubscriptionRepository'
import { Subscription } from '../../database/entities/Subscription'
import { User } from '../../database/entities/User'
import {DeleteResult} from "typeorm/query-builder/result/DeleteResult";

export class SubscriptionService {
  private static instance: SubscriptionService

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
    subscription.itemTable = getConnection().getMetadata(item.constructor.name).tableName

    await this.getSubscriptionRepository().save(subscription)

    return this.getSubscriptionRepository().reload(subscription)
  }

  async unsubscribe(user: User, item: any): Promise<DeleteResult> {
    const existingSubscription = await this.getSubscriptionRepository().findOne({
      userId: user.id,
      itemId: item.id
    })

    if (existingSubscription) {
      return this.getSubscriptionRepository().delete(existingSubscription.id)
    }
  }

}
