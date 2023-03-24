import { IActivityData } from './ActivityData'

export interface IActivityObject {
  push: boolean
  pushTo: string
  persist: boolean
  handler: string
  data: IActivityData
}
