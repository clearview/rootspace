import { Activity } from '../../database/entities/Activity'

export interface IActivityAggregator {
  aggregate(activities: Activity[]): Activity[]
}
