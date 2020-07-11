import httpRequestContext from 'http-request-context'
import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { Task } from '../entities/tasks/Task'
import slugify from '@sindresorhus/slugify'
import { NotificationService } from '../../services'
import { EventAction, EventType, IEventProvider } from '../../services/events/EventType'
import { FollowableInterface } from '../../services/Followable'
import { User } from '../entities/User'
import { FollowService } from '../../services/FollowService'
import { TaskRepository } from '../../repositories/tasks/TaskRepository'

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
    const entity = await event.manager
        .getCustomRepository(TaskRepository)
        .findOneOrFail({ id: event.entity.id})

    await this.onCreated(event.entity.user, entity)
  }

  async beforeUpdate(event: UpdateEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async afterUpdate(event: UpdateEvent<Task>) {
    const actor = httpRequestContext.get('user')

    if (actor.id === event.entity.userId) {
      return
    }

    await this.onUpdated(actor, event.entity, event.metadata)
  }

  /**
   * FollowableInterface
   */
  async onCreated(user: User, entity: Task): Promise<void> {
    await FollowService.getInstance().follow(user, entity)
  }

  async onUpdated(actor: User, entity: Task, metaData?: EntityMetadata): Promise<void> {
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

}
