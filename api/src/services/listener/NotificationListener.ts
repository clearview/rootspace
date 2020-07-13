import { EventAction, EventType, IEventProvider } from '../events/EventType'
import { FollowService } from '../FollowService'
import { NotificationService } from '../NotificationService'

export class NotificationListener {
    private static instance: NotificationListener
    private followService: FollowService

    private constructor() {
        this.followService = FollowService.getInstance()
    }

    static getInstance() {
        if (!NotificationListener.instance) {
            NotificationListener.instance = new NotificationListener()

            NotificationService.emitter().on(EventType.Notification, (event: IEventProvider) => {
                NotificationListener.instance.processEvent(event)
            })
        }

        return NotificationListener.instance
    }

    async processEvent(event: IEventProvider): Promise<void> {
        switch(event.action) {
            case EventAction.Created:
                break

            case EventAction.Updated:
                return this.createNotifications(event)

            case EventAction.Deleted:
                return this.removeFollowsAndNotifications(event)
        }
    }

    async createNotifications(event: IEventProvider): Promise<void> {
        await this.followService.createNotifications(event)
    }

    async removeFollowsAndNotifications(event: IEventProvider): Promise<void> {
        switch(event.targetName) {
            case 'TaskComment':
                break

            default:
                await this.followService.removeFollowsAndNotifications(event)
                break
        }
    }
}
