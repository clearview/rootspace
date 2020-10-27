import { Activity } from '../../../database/entities/Activity'
import { Notification } from '../../../database/entities/Notification'
import { IActivityProcessor } from './types'
import { ContentActions, TaskActions } from '../activities/content/actions'

const aggregateActions: string[] = [
  TaskActions.Tag_Added,
  TaskActions.Tag_Removed,
  TaskActions.Assignee_Added,
  TaskActions.Assignee_Removed,
  TaskActions.Attachment_Added,
  TaskActions.Attachment_Removed,
]

const notificationProperty = 'notification'

export class TaskActivityProcessor implements IActivityProcessor {
  private aggregateActions = []

  constructor() {
    this.aggregateActions = aggregateActions
  }

  public process(activities: Activity[]): Activity[] {
    activities = this.filter(activities)
    activities = this.processNotifications(activities)

    const entries: Activity[] = []

    let joint: Activity[] = []

    for (const activity of activities) {
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

  private processNotifications(activities: Activity[]): Activity[] {
    const result = []

    for (const activity of activities) {
      if (!activity[notificationProperty]) {
        result.push(activity)
        continue
      }

      const notification = activity[notificationProperty].id
      Object.assign(activity, { notification: [notification] })

      result.push(activity)
    }

    return result
  }

  private processJoint(joint: Activity[]): Activity {
    const activity = joint[0]

    if (activity[notificationProperty]) {
      activity[notificationProperty] = joint.map((entry) => entry[notificationProperty][0])
    }

    if (activity.action === TaskActions.Tag_Added || activity.action === TaskActions.Tag_Removed) {
      return this.assembleContextProperty(joint, 'tag')
    }

    if (activity.action === TaskActions.Attachment_Added || activity.action === TaskActions.Attachment_Removed) {
      return this.assembleContextProperty(joint, 'attachment')
    }

    if (activity.action === TaskActions.Assignee_Added || activity.action === TaskActions.Assignee_Removed) {
      return this.assembleContextProperty(joint, 'assignee')
    }

    const context = joint.map((j) => j.context)

    activity.context = context
    return activity
  }

  private assembleContextProperty(joint: Activity[], property: string): Activity {
    const activity = joint[0]
    const context = activity.context as any

    const values = joint.map((j) => (j.context as any)[property])

    context[property] = values
    activity.context = context

    return activity
  }
}
