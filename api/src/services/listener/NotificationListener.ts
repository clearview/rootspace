import { EventAction, EventType, IEventProvider } from '../events/EventType'
import { FollowService } from '../FollowService'
import { NotificationService } from '../NotificationService'
import { ListenerInterface } from './ListenerInterface'
import { DocListener } from './DocListener'
import { TaskListener } from './TaskListener'

export enum ListenerName {
    Doc = 'Doc',
    Task = 'Task'
}

interface Listener { [key: string]: ListenerInterface }

export class NotificationListener implements ListenerInterface {
    private static instance: NotificationListener
    private followService: FollowService
    public listeners: Listener[] = []

    private constructor() {
        this.followService = FollowService.getInstance()
    }

    static getInstance() {
        if (!NotificationListener.instance) {
            NotificationListener.instance = new NotificationListener()

            // Global listener (all events)
            NotificationService.emitter().on(EventType.Notification, async (event: IEventProvider) => {
                await NotificationListener.instance.processEvent(event)
            })

            // Specific listeners
            this.registerListeners()
        }

        return NotificationListener.instance
    }

    private static registerListeners() {
        this.instance.listeners.push({ [ListenerName.Doc]: DocListener.getInstance() })
        this.instance.listeners.push({ [ListenerName.Task]: TaskListener.getInstance() })
    }

    async processEvent(event: IEventProvider): Promise<void> {
        switch(event.action) {
            case EventAction.Updated:
                await this.followService.createNotifications(event)
            break

            case EventAction.Deleted:
                await this.followService.removeFollowsFromEvent(event)
            break
        }
    }
}
