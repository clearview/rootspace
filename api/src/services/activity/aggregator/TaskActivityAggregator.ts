import { Activity } from '../../../database/entities/Activity'
import { IActivityAggregator } from '../types'
import { ContentActions, TaskActions } from '../activities/content/actions'

const aggregateActions = [
  TaskActions.Tag_Added,
  TaskActions.Tag_Removed,
  TaskActions.Assignee_Added,
  TaskActions.Assignee_Removed,
  TaskActions.Attachment_Added,
  TaskActions.Attachment_Removed,
]

export class TaskActivityAggregator implements IActivityAggregator {
  protected aggregateActions = []

  constructor() {
    this.aggregateActions = aggregateActions
  }

  public aggregate(activities: Activity[]): Activity[] {
    const filtered = this.filter(activities)
    const entries: Activity[] = []

    for (const activity of filtered) {
      if (!this.aggregateActions.includes(activity.action)) {
        entries.push(activity)
        continue
      }

      if (entries.length === 0) {
        const entry = this.createEntry(activity)
        entries.push(entry)

        continue
      }

      const lastEntry = entries[entries.length - 1]

      if (activity.action !== lastEntry.action) {
        const entry = this.createEntry(activity)

        entries.push(entry)

        continue
      }

      const context = lastEntry.context as object[]
      context.push(activity.context)

      lastEntry.context = context
    }

    return entries
  }

  private filter(activities: Activity[]): Activity[] {
    const filtered = []

    for (const activity of activities) {
      const context = activity.context as any

      if (activity.action === ContentActions.Updated && context.updatedAttributes.length === 0) {
        continue
      }

      filtered.push(activity)
    }

    return filtered
  }

  protected createEntry(activity: Activity): Activity {
    return { ...activity, context: [activity.context] }
  }
}
