import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { Task } from '../entities/tasks/Task'
import slugify from '@sindresorhus/slugify'
import { NotificationListener } from '../../services'
import { EventAction, EventType, IEventProvider } from '../../services/events/EventType'
import { FollowableInterface } from '../../services/Followable'
import httpContext from 'express-http-context'
import { User } from '../entities/User'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task>, FollowableInterface<Task> {
  /**
   * EntitySubscriberInterface
   */
  listenTo() {
    return Task
  }

  async beforeInsert(event: InsertEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async afterInsert(event: InsertEvent<Task>) {
    const user = httpContext.get('user')
    await this.onCreated(user, event.entity, event.metadata)
  }

  async beforeUpdate(event: UpdateEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async afterUpdate(event: UpdateEvent<Task>) {
    const user = httpContext.get('user')
    await this.onUpdated(user, event.entity, event.metadata)
  }

  /**
   * FollowableInterface
   */
  async onCreated(user: User, entity: Task, metaData: EntityMetadata): Promise<void> {
    const event: IEventProvider = {
      id: entity.id,
      userId: user.id,
      tableName: metaData.tableName,
      action: EventAction.Created
    }

    NotificationListener.getInstance().emitter.emit( EventType.Notification, event)
    return Promise.resolve(undefined)
  }

  async onUpdated(user: User, entity: Task, metaData: EntityMetadata): Promise<void> {
    const event: IEventProvider = {
      id: entity.id,
      userId: user.id,
      tableName: metaData.tableName,
      action: EventAction.Updated
    }

    NotificationListener.getInstance().emitter.emit( EventType.Notification, event)

    return Promise.resolve(undefined)
  }

}
