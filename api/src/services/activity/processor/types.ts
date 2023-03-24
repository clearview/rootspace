import { Activity } from '../../../database/entities/Activity'

export interface IActivityProcessor {
  process(activities: Activity[]): Activity[]
}
