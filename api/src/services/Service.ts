import { IService, IActivityObserver } from './contracts'
import { IAppActivity } from './activity/activities/types'

export abstract class Service implements IService {
  private activityObservers: IActivityObserver[] = []

  public attachActivityObserver(observer: IActivityObserver): void {
    const isExist = this.activityObservers.includes(observer)

    if (isExist) {
      return
    }

    this.activityObservers.push(observer)
  }

  public detachActivityObserver(observer: IActivityObserver): void {
    const observerIndex = this.activityObservers.indexOf(observer)

    if (observerIndex === -1) {
      return
    }

    this.activityObservers.splice(observerIndex, 1)
  }

  async notifyActivity(activity: IAppActivity): Promise<void> {
    for (const observer of this.activityObservers) {
      await observer.activityNotification(activity)
    }
  }
}
