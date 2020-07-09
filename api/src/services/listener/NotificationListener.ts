import { EventEmitter } from 'events'
import { EventAction, EventType, IEventProvider } from '../../types/event'
import { SubscriptionService } from '../content/SubscriptionService'

export class NotificationListener {
    private static instance: NotificationListener
    private subscriptionService: SubscriptionService
    public emitter: EventEmitter

    private constructor(emitter: EventEmitter) {
        this.emitter = emitter
        this.subscriptionService = SubscriptionService.getInstance()
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
                return this.removeSubscriptions(event)
        }
    }

    async createNotifications(event: IEventProvider): Promise<void> {
        await this.subscriptionService.createNotifications(event)
    }

    async removeSubscriptions(event: IEventProvider): Promise<void> {
        await this.subscriptionService.removeAllFromEvent(event)
    }
}
