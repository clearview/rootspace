import { IEventProvider } from '../events/EventType'

export interface ListenerInterface {
    processEvent(event: IEventProvider): Promise<void>
}