import { Activity } from '../../../database/entities/Activity'
import { IActivityAggregator } from '../types'

export abstract class ActivityAggregator implements IActivityAggregator {
  protected aggregateActions = []

  public abstract aggregate(activities: Activity[]): Activity[]

  protected createEntry(activity: Activity): Activity {
    return { ...activity, context: [activity.context] }
  }
}
