import { IActivityData } from '../ActivityData'

export interface ISpaceActivityData extends IActivityData {
  actorId: number
  spaceId: number
  context: object
}
