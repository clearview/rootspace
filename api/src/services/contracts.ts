import { Activity } from './activity/activities/Activity'

export interface IService {
  attachActivityObserver(observer: IActivityObserver): void
  detachActivityObserver(observer: IActivityObserver): void
  notifyActivity(activity: Activity): void
}

export interface IActivityObserver {
  activityNotification(activity: Activity): Promise<void>
}
