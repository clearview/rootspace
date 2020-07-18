import httpRequestContext from 'http-request-context'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent
} from 'typeorm'
import { TaskList } from '../entities/tasks/TaskList'
import { EventAction, IEventProvider } from '../../services/events/EventType'
import { FollowService } from '../../services/FollowService'

@EventSubscriber()
export class TaskListSubscriber implements EntitySubscriberInterface<TaskList> {
  private static instance: TaskListSubscriber
  private followService: FollowService

  private constructor() {
    this.followService = FollowService.getInstance()
  }

  static getInstance() {
    if (!TaskListSubscriber.instance) {
      TaskListSubscriber.instance = new TaskListSubscriber()
    }

    return TaskListSubscriber.instance
  }

  /**
   * EntitySubscriberInterface
   */
  listenTo() {
    return TaskList
  }

  async beforeRemove(event: RemoveEvent<TaskList>) {
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

    await this.followService.removeFollowsAndNotificationsForTaskBoardList(notificationEvent)
  }

}
