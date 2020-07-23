import httpRequestContext from 'http-request-context'
import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { TaskComment } from '../../entities/tasks/TaskComment'
import { NotificationService } from '../../../services'
import { EventAction, EventType, IEventProvider } from '../../../services/events/EventType'
import { FollowableInterface } from '../FollowableInterface'
import { User } from '../../entities/User'

@EventSubscriber()
export class TaskCommentSubscriber implements EntitySubscriberInterface<TaskComment>, FollowableInterface<TaskComment> {
  /**
   * EntitySubscriberInterface
   */
  listenTo() {
    return TaskComment
  }

  async afterInsert(event: InsertEvent<TaskComment>) {
    const actor = httpRequestContext.get('user')
    await this.onCreated(actor, event.entity, event.metadata)
  }

  async afterUpdate(event: UpdateEvent<TaskComment>) {
    const actor = httpRequestContext.get('user')
    await this.onUpdated(actor, event.entity, event.metadata)
  }

  /**
   * FollowableInterface
   */
  async onCreated(actor: User, entity: TaskComment, metaData?: EntityMetadata): Promise<void> {
    if (!actor) {
      return
    }

    // Dispatch Task event
    const event: IEventProvider = {
      itemId: entity.taskId,
      actorId: actor.id,
      targetName: metaData?.targetName,
      tableName: 'tasks',
      action: EventAction.Updated,
      message: `${actor.fullName()} commented on ${entity.task?.title}`
    }

    NotificationService.emit(EventType.Notification, event)
    return Promise.resolve(undefined)
  }

  async onUpdated(actor: User, entity: TaskComment, metaData?: EntityMetadata): Promise<void> {
    return this.onCreated(actor, entity, metaData)
  }
}
