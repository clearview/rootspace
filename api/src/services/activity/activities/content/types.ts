import { IAppActivity, IAppActivityData } from '../types'

export interface IContentEntity {
  id: number
  spaceId: number
}

export interface IContentActivityData extends IAppActivityData {
  actorId: number
  spaceId: number
  entityId: number
  entity: string
  action: string
  type: string
  tableName: string
  context: object
  handler: string
}

export interface IContentActivity extends IAppActivity {
  getEntityName(): string
}

export interface IContentActivityHandler {
  process(): Promise<void>
}
