export interface IAppActivityData {
  activityId?: number
  actorId?: number
  spaceId?: number
  entityId: number
  entity: string
  action: string
  type: string
  context?: object
  handler?: string
}

export interface IAppActivity {
  getType(): string
  toObject(): IAppActivityData
}

export interface IActivityHandler {
  process(): Promise<void>
}

export const ActivityType = {
  App: 'app',
  User: 'user',
  Space: 'space',
  Content: 'content',
}
