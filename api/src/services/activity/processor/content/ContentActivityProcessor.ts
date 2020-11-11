import { Activity } from '../../../../database/entities/Activity'
import { IActivityProcessor } from '../types'
import { ActivityProcessor } from '../ActivityProcessor'
import { ContentActions } from '../../activities/content/actions'

export class ContentActivityProcessor extends ActivityProcessor implements IActivityProcessor {
  protected aggregateActions = []

  constructor() {
    super()
  }

  public process(activities: Activity[]): Activity[] {
    activities = this.filter(activities)
    activities = this.processNotifications(activities)

    return activities
  }

  protected filter(activities: Activity[]): Activity[] {
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

  protected aggregate(activities: Activity[]): Activity[] {
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

  protected processJoint(activities: Activity[]): Activity {
    return activities.pop()
  }

  protected compareActivities(activit1: Activity, activity2: Activity): boolean {
    if (activit1.actorId !== activity2.actorId) {
      return false
    }

    if (activit1.action !== activity2.action) {
      return false
    }

    return true
  }

  protected assembleContextProperty(joint: Activity[], property: string): Activity {
    const activity = joint[0]
    const context = activity.context as any

    const values = joint.map((j) => (j.context as any)[property])

    context[property] = values
    activity.context = context

    return activity
  }
}
