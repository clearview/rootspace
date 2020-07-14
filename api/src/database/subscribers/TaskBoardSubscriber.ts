import httpRequestContext from 'http-request-context'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent
} from 'typeorm'
import { TaskBoard } from '../entities/tasks/TaskBoard'
import { EventAction, EventType, IEventProvider } from '../../services/events/EventType'
import { FollowService } from '../../services/FollowService'

@EventSubscriber()
export class TaskBoardSubscriber implements EntitySubscriberInterface<TaskBoard> {
  private static instance: TaskBoardSubscriber
  private followService: FollowService

  private constructor() {
    this.followService = FollowService.getInstance()
  }

  static getInstance() {
    if (!TaskBoardSubscriber.instance) {
      TaskBoardSubscriber.instance = new TaskBoardSubscriber()
    }

    return TaskBoardSubscriber.instance
  }

  /**
   * EntitySubscriberInterface
   */
  listenTo() {
    return TaskBoard
  }

  async beforeRemove(event: RemoveEvent<TaskBoard>) {
    const actor = httpRequestContext.get('user')
    const entity = event.entity

    const notificationEvent: IEventProvider = {
      itemId: entity.id,
      actorId: actor.id,
      targetName: event.metadata?.targetName,
      tableName: event.metadata?.tableName,
      action: EventAction.Deleted,
      message: `${actor.fullName()} removed ${entity.title}`
    }

    await this.followService.removeFollowsAndNotificationsForTaskBoard(notificationEvent)
  }

}
