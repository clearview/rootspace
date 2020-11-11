import { Activity } from '../../../../database/entities/Activity'
import { IActivityProcessor } from '../types'
import { TaskActions } from '../../activities/content/actions'
import { ContentActivityProcessor } from './ContentActivityProcessor'

const aggregateActions: string[] = [
  TaskActions.Tag_Added,
  TaskActions.Tag_Removed,
  TaskActions.Assignee_Added,
  TaskActions.Assignee_Removed,
  TaskActions.Attachment_Added,
  TaskActions.Attachment_Removed,
]

export class TaskActivityProcessor extends ContentActivityProcessor implements IActivityProcessor {
  constructor() {
    super()
    this.aggregateActions = aggregateActions
  }

  public process(activities: Activity[]): Activity[] {
    activities = this.filter(activities)
    activities = this.processNotifications(activities)
    activities = this.aggregate(activities)

    return activities
  }

  protected processJoint(activities: Activity[]): Activity {
    const activity = activities[0]

    if (activity[this.notificationProperty]) {
      activity[this.notificationProperty] = activities.map((entry) => entry[this.notificationProperty][0])
    }

    if (activity.action === TaskActions.Tag_Added || activity.action === TaskActions.Tag_Removed) {
      return this.assembleContextProperty(activities, 'tag')
    }

    if (activity.action === TaskActions.Attachment_Added || activity.action === TaskActions.Attachment_Removed) {
      return this.assembleContextProperty(activities, 'attachment')
    }

    if (activity.action === TaskActions.Assignee_Added || activity.action === TaskActions.Assignee_Removed) {
      return this.assembleContextProperty(activities, 'assignee')
    }

    const context = activities.map((j) => j.context)

    activity.context = context
    return activity
  }
}
