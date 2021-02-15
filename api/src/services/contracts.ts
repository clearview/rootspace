import { IActivity } from './activity/activities/Activity'

export interface IService {
  attachActivityObserver(observer: IActivityObserver): void
  detachActivityObserver(observer: IActivityObserver): void
  notifyActivity(activity: IActivity): void
}

export interface IActivityObserver {
  activityNotification(activity: IActivity): Promise<void>
}
