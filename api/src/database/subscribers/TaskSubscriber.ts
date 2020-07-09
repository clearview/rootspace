import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { Task } from '../entities/tasks/Task'
import slugify from '@sindresorhus/slugify'
import { NotificationListener } from '../../services'
import { EventAction, EventType, IEventProvider } from '../../types/event'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
  listenTo() {
    return Task
  }

  async beforeInsert(event: InsertEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async afterInsert(event: InsertEvent<Task>) {
    NotificationListener.getInstance().emitter.emit( EventType.Notification, {
      id: event.entity.id,
      tableName: event.metadata.tableName,
      action: EventAction.Created
    })
  }

  async beforeUpdate(event: UpdateEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async afterUpdate(event: UpdateEvent<Task>) {
    NotificationListener.getInstance().emitter.emit( EventType.Notification, {
      id: event.entity.id,
      tableName: event.metadata.tableName,
      action: EventAction.Updated
    })
  }
}
