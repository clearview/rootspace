export enum EventType {
  Notification = 'notification'
}

export enum EventAction {
  Created = 'created',
  Updated = 'updated',
  Deleted = 'deleted'
}

export interface IEventProvider {
  id: number
  userId?: number
  tableName: string
  action?: EventAction
}
