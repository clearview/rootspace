export enum EventType {
  Notification = 'notification'
}

export enum EventAction {
  Created = 'created',
  Updated = 'updated',
  Deleted = 'deleted'
}

export interface IEventProvider {
  itemId: number
  userId?: number
  actorId?: number
  targetName?: string
  tableName: string
  message?: string
  action?: EventAction
}
