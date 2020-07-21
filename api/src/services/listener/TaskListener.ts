import { EventAction, EventType, IEventProvider } from '../events/EventType'
import { TaskService } from '../content/tasks'
import { NotificationService } from '../NotificationService'
import { ListenerInterface } from './ListenerInterface'
import { FollowService } from '../FollowService'
import { Task } from '../../database/entities/tasks/Task'

export class TaskListener implements ListenerInterface {
    private static instance: TaskListener
    private readonly taskService: TaskService

    private constructor() {
        this.taskService = TaskService.getInstance()
    }

    static getInstance() {
        if (!TaskListener.instance) {
            TaskListener.instance = new TaskListener()
        }

        NotificationService.emitter().on(EventType.Notification, async (event: IEventProvider) => {
            if (event.targetName === Task.name) {
                await TaskListener.instance.processEvent(event)
            }
        })

        return TaskListener.instance
    }

    async processEvent(event: IEventProvider): Promise<void> {
        switch(event.action) {
            case EventAction.Created:
                await FollowService.getInstance().followFromEvent(event)
                break

            case EventAction.Updated:
                break

            case EventAction.Deleted:
                break
        }
    }
}
