import { EventAction, EventType, IEventProvider } from '../events/EventType'
import { DocService } from '..'
import { Doc } from '../../database/entities/Doc'
import { NotificationService } from '../NotificationService'
import { ListenerInterface } from './ListenerInterface'
import { FollowService } from '../FollowService'

export class DocListener implements ListenerInterface {
    private static instance: DocListener
    private readonly docService: DocService

    private constructor() {
        this.docService = DocService.getInstance()
    }

    static getInstance() {
        if (!DocListener.instance) {
            DocListener.instance = new DocListener()
        }

        NotificationService.emitter().on(EventType.Notification, async (event: IEventProvider) => {
            if (event.targetName === Doc.name) {
                await DocListener.instance.processEvent(event)
            }
        })

        return DocListener.instance
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
