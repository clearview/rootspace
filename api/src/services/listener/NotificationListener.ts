import { EventEmitter } from 'events'
import { EventAction, EventType, IEventProvider } from '../events/EventType'
import { FollowService } from '../FollowService'
import { NotificationService } from '../NotificationService'

export class NotificationListener {
    private static instance: NotificationListener
    private followService: FollowService
    private notificationService: NotificationService
    public emitter: EventEmitter

    private constructor(emitter: EventEmitter) {
        this.emitter = emitter
        this.notificationService = NotificationService.getInstance()
        this.followService = FollowService.getInstance()
    }

    static getInstance() {
        if (!NotificationListener.instance) {
            const eventEmitter = new EventEmitter()

            eventEmitter.on(EventType.Notification, (event: IEventProvider) => {
                NotificationListener.instance.processEvent(event)
            })

            NotificationListener.instance = new NotificationListener(eventEmitter)
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
                return this.removeFollows(event)
        }
    }

    async createNotifications(event: IEventProvider): Promise<void> {
        await this.followService.createNotifications(event)
    }

    async removeFollows(event: IEventProvider): Promise<void> {
        await this.followService.removeAllFromEvent(event)
    }
}
