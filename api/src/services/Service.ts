import { IService, IActivityObserver } from './contracts'
import { IAppActivity } from './activity/activities/types'

export abstract class Service implements IService {
  private activityObservers: IActivityObserver[] = []

  public attachActivityObserver(observer: IActivityObserver): void {
    const isExist = this.activityObservers.includes(observer)
    if (isExist) {
      return console.log('Subject: Observer has been attached already.')
    }

    console.log('Subject: Attached an observer.')
    this.activityObservers.push(observer)
  }

  public detachActivityObserver(observer: IActivityObserver): void {
    const observerIndex = this.activityObservers.indexOf(observer)
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.')
    }

    this.activityObservers.splice(observerIndex, 1)
    console.log('Subject: Detached an observer.')
  }

  async notifyActivity(activity: IAppActivity): Promise<void> {
    console.log('Subject: Notifying observers...')
    for (const observer of this.activityObservers) {
      await observer.activityNotification(activity)
    }
  }
}
