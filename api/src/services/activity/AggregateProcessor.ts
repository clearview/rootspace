import { Activity } from '../../database/entities/Activity'
import { IActivityAggregator } from './types'
import { TaskActivityAggregator } from './aggregator/TaskActivityAggregator'

export class AggregateProcessor {
  private aggregator: IActivityAggregator
  private activities: Activity[]

  constructor(activities: Activity[], entity: string) {
    this.activities = activities

    switch (entity) {
      case 'task':
        this.aggregator = new TaskActivityAggregator()
        break
      default:
        break
    }
  }

  public aggregate(): Activity[] {
    if (!this.aggregator) {
      return this.activities
    }

    return this.aggregator.aggregate(this.activities)
  }
}
