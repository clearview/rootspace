import 'dotenv/config'
import { BaseWorker } from './BaseWorker'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { DocActivities } from '../../database/entities/activities/DocActivities'

export class DocWorker extends BaseWorker {
  private static instance: DocWorker

  private constructor() {
    super()
  }

  static getInstance() {
    if (!DocWorker.instance) {
      DocWorker.instance = new DocWorker()
    }

    return DocWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {
    await this.notifyFollowers(event)

    switch (event.action) {
      case DocActivities.Created:
        await this.followActivity(event)
        break
      case DocActivities.Deleted:
        await this.unfollowActivity(event)
        break
    }
  }
}