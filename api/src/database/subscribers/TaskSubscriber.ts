import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { Task } from '../entities/tasks/Task'
import slugify from '@sindresorhus/slugify'
import { NotificationListener } from '../../services'
import { EventAction, EventType } from '../../services/events/EventType'
import { FollowableInterface } from '../../services/Followable'

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
    await this.onCreated(event.entity, event.metadata)
  }

  async beforeUpdate(event: UpdateEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async afterUpdate(event: UpdateEvent<Task>) {
    await this.onUpdated(event.entity, event.metadata)
  }

  /**
   * FollowableInterface
   */
  async onCreated(entity: Task, metaData: EntityMetadata): Promise<void> {
    NotificationListener.getInstance().emitter.emit( EventType.Notification, {
      id: entity.id,
      tableName: metaData.tableName,
      action: EventAction.Created
    })

    return Promise.resolve(undefined)
  }

  async onUpdated(entity: Task, metaData: EntityMetadata): Promise<void> {
    NotificationListener.getInstance().emitter.emit( EventType.Notification, {
      id: entity.id,
      tableName: metaData.tableName,
      action: EventAction.Updated
    })

    return Promise.resolve(undefined)
  }

}
