import httpRequestContext from 'http-request-context'
import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent
} from 'typeorm'
import { TaskBoard } from '../entities/tasks/TaskBoard'
import { NotificationService } from '../../services'
import { EventAction, EventType, IEventProvider } from '../../services/events/EventType'
import { FollowableInterface } from '../../services/Followable'
import { User } from '../entities/User'

@EventSubscriber()
export class TaskBoardSubscriber implements EntitySubscriberInterface<TaskBoard>, FollowableInterface<TaskBoard> {
  /**
   * EntitySubscriberInterface
   */
  listenTo() {
    return TaskBoard
  }

  async beforeRemove(event: RemoveEvent<TaskBoard>) {
    const actor = httpRequestContext.get('user')
    await this.onRemoved(actor, event.entity, event.metadata)
  }

  /**
   * FollowableInterface
   */
  async onRemoved(actor: User, entity: TaskBoard, metaData?: EntityMetadata): Promise<void> {
    const event: IEventProvider = {
      itemId: entity.id,
      actorId: actor.id,
      targetName: metaData?.targetName,
      tableName: metaData?.tableName,
      action: EventAction.Deleted,
      message: `${actor.fullName()} removed ${entity.title}`
    }

    NotificationService.emit(EventType.Notification, event)
    return Promise.resolve(undefined)
  }

}
