import { Activity } from '../../../database/entities/Activity'
import { IActivityAggregator } from '../types'
import { ContentActions, TaskActions } from '../activities/content/actions'

const aggregateActions: string[] = [
  TaskActions.Tag_Added,
  TaskActions.Tag_Removed,
  TaskActions.Assignee_Added,
  TaskActions.Assignee_Removed,
  TaskActions.Attachment_Added,
  TaskActions.Attachment_Removed,
]

export class TaskActivityAggregator implements IActivityAggregator {
  private aggregateActions = []

  constructor() {
    this.aggregateActions = aggregateActions
  }

  public aggregate(activities: Activity[]): Activity[] {
    const filtered = this.filter(activities)
    const entries: Activity[] = []

    let joint: Activity[] = []

    for (const activity of filtered) {
      if (!this.aggregateActions.includes(activity.action)) {
        entries.push(activity)
        continue
      }

      if (entries.length === 0) {
        joint.push(activity)
        continue
      }

      if (this.compareActivities(activity, joint[joint.length - 1]) === true) {
        joint.push(activity)
        continue
      }

      entries.push(this.processJoint(joint))

      joint = []
      joint.push(activity)
    }

    if (joint.length > 0) {
      entries.push(this.processJoint(joint))
    }

    return entries
  }

  private compareActivities(activit1: Activity, activity2: Activity): boolean {
    if (activit1.actorId !== activity2.actorId) {
      return false
    }

    if (activit1.action !== activity2.action) {
      return false
    }

    return true
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

  private processJoint(joint: Activity[]): Activity {
    const activity = joint[0]

    if (activity.action === TaskActions.Tag_Added || activity.action === TaskActions.Tag_Removed) {
      return this.processGatherContextProperty(joint, 'tag')
    }

    if (activity.action === TaskActions.Attachment_Added || activity.action === TaskActions.Attachment_Removed) {
      return this.processGatherContextProperty(joint, 'attachment')
    }

    if (activity.action === TaskActions.Assignee_Added || activity.action === TaskActions.Assignee_Removed) {
      return this.processGatherContextProperty(joint, 'assignee')
    }

    const context = joint.map((j) => j.context)

    activity.context = context
    return activity
  }

  private processGatherContextProperty(joint: Activity[], property: string): Activity {
    const activity = joint[0]
    const context = activity.context as any

    const values = joint.map((j) => (j.context as any)[property])

    context[property] = values
    activity.context = context

    return activity
  }
}
