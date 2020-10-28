import { Activity } from '../../../database/entities/Activity'
import { IActivityProcessor } from './types'

export class ActivityProcessor implements IActivityProcessor {
  protected notificationProperty = 'notification'

  public process(activities: Activity[]): Activity[] {
    return this.processNotifications(activities)
  }

  protected processNotifications(activities: Activity[]): Activity[] {
    const result = []

    for (const activity of activities) {
      if (!activity[this.notificationProperty]) {
        result.push(activity)
        continue
      }

      const notification = activity[this.notificationProperty].id
      Object.assign(activity, { notification: [notification] })

      result.push(activity)
    }

    return result
  }
}
