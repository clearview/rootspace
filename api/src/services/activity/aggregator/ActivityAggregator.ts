import { Activity } from '../../../database/entities/Activity'
import { TaskActivityAggregator } from './TaskActivityAggregator'
import { IActivityAggregator } from '../types'

export class ActivityAggregator implements IActivityAggregator {
  public aggregate(activities: Activity[]): Activity[] {
    if (activities.length === 0) {
      return activities
    }

    const entries: Activity[] = []
    let joint: Activity[] = []

    for (const activity of activities) {
      if (joint.length === 0) {
        joint.push(activity)
        continue
      }

      const latsJoint = joint[joint.length - 1]

      if (this.compareActivities(activity, latsJoint) === true) {
        joint.push(activity)
        continue
      }

      entries.push(...this.processJoint(joint))

      joint = []
      joint.push(activity)
    }

    if (joint.length > 0) {
      entries.push(...this.processJoint(joint))
    }

    return entries
  }

  private processJoint(joint: Activity[]): Activity[] {
    const jointAggregator = this.getAggregator(joint[0])

    if (jointAggregator === null) {
      return joint
    }

    return jointAggregator.aggregate(joint)
  }

  private compareActivities(activity1: Activity, activity2: Activity): boolean {
    const compare: string[] = ['actorId', 'spaceId', 'entity', 'entityId', 'action']

    for (const attribute of compare) {
      if (activity1[attribute] !== activity2[attribute]) {
        return false
      }
    }

    return true
  }

  private getAggregator(activity: Activity): IActivityAggregator | null {
    if (activity.entity && activity.entity === 'Task') {
      return new TaskActivityAggregator()
    }

    return null
  }
}
