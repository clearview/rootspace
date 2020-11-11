import { Activity } from '../../../database/entities/Activity'
import { IActivityProcessor } from './types'
import { ActivityProcessor } from './ActivityProcessor'
import { ContentActivityProcessor } from './content/ContentActivityProcessor'
import { TaskActivityProcessor } from './content/TaskActivityProcessor'

export function processActivities(activities: Activity[]): Activity[] {
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

    if (compareActivities(activity, latsJoint) === true) {
      joint.push(activity)
      continue
    }

    entries.push(...processJoint(joint))

    joint = []
    joint.push(activity)
  }

  if (joint.length > 0) {
    entries.push(...processJoint(joint))
  }

  return entries
}

function processJoint(activities: Activity[]): Activity[] {
  const processor = getProcessor(activities[0])

  if (processor === null) {
    return activities
  }

  return processor.process(activities)
}

function compareActivities(activity1: Activity, activity2: Activity): boolean {
  const compare: string[] = ['actorId', 'spaceId', 'entity', 'entityId', 'action']

  for (const attribute of compare) {
    if (activity1[attribute] !== activity2[attribute]) {
      return false
    }
  }

  return true
}

function getProcessor(activity: Activity): IActivityProcessor {
  if (activity.type === 'content') {
    if (activity.entity === 'Task') {
      return new TaskActivityProcessor()
    }

    return new ContentActivityProcessor()
  }

  return new ActivityProcessor()
}
