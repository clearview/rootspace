import { IAppActivity, IAppActivityData } from '../types'

export interface IContentEntity {
  id: number
  spaceId: number
}

export interface IContentActivityData extends IAppActivityData {
  actorId: number
  spaceId: number
  context: object
}

export interface IContentActivity extends IAppActivity {
  getEntityName(): string
}
