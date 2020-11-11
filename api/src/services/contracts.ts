import { IAppActivity } from './activity/activities/types'

export interface IService {
  attachActivityObserver(observer: IActivityObserver): void
  detachActivityObserver(observer: IActivityObserver): void
  notifyActivity(activity: IAppActivity): void
}

export interface IActivityObserver {
  activityNotification(activity: IAppActivity): Promise<void>
}
