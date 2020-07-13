import httpRequestContext from 'http-request-context'
import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, RemoveEvent, UpdateEvent
} from 'typeorm'
import { Doc } from '../entities/Doc'
import { NotificationService } from '../../services'
import { EventAction, EventType, IEventProvider } from '../../services/events/EventType'
import { FollowableInterface } from '../../services/Followable'
import { User } from '../entities/User'
import { FollowService } from '../../services/FollowService'
import { DocRepository } from '../../repositories/DocRepository'

@EventSubscriber()
export class DocSubscriber implements EntitySubscriberInterface<Doc>, FollowableInterface<Doc> {
  /**
   * EntitySubscriberInterface
   */
  listenTo() {
    return Doc
  }

  async afterInsert(event: InsertEvent<Doc>) {
    const entity = await event.manager
        .getCustomRepository(DocRepository)
        .findOneOrFail({ id: event.entity.id})

    await this.onCreated(entity.user, entity)
  }

  async afterUpdate(event: UpdateEvent<Doc>) {
    const actor = httpRequestContext.get('user')
    await this.onUpdated(actor, event.entity, event.metadata)
  }

  async beforeRemove(event: RemoveEvent<Doc>) {
    const actor = httpRequestContext.get('user')
    await this.onRemoved(actor, event.entity, event.metadata)
  }

  /**
   * FollowableInterface
   */
  async onCreated(user: User, entity: Doc): Promise<void> {
    await FollowService.getInstance().follow(user, entity)
  }

  async onUpdated(actor: User, entity: Doc, metaData?: EntityMetadata): Promise<void> {
    const event: IEventProvider = {
      itemId: entity.id,
      actorId: actor.id,
      targetName: metaData?.targetName,
      tableName: metaData?.tableName,
      action: EventAction?.Updated,
      message: `${actor.fullName()} edited ${entity.title}`
    }

    NotificationService.emit(EventType.Notification, event)
    return Promise.resolve(undefined)
  }

  async onRemoved(actor: User, entity: Doc, metaData?: EntityMetadata): Promise<void> {
    const event: IEventProvider = {
      itemId: entity.id,
      actorId: actor.id,
      targetName: metaData?.targetName,
      tableName: metaData?.tableName,
      action: EventAction?.Deleted,
      message: `${actor.fullName()} removed ${entity.title}`
    }

    NotificationService.emit(EventType.Notification, event)
    return Promise.resolve(undefined)
  }
}
