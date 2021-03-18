import { IActivityData } from '../ActivityData'

export interface IContentActivityData extends IActivityData {
  actorId: number
  spaceId: number
  context: object
}
