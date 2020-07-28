import { Job } from 'bull'
import { ActivityRepository } from '../../../database/repositories/ActivityRepository'
import { Activity } from '../../../database/entities/Activity'
import { getCustomRepository } from 'typeorm'

export class TaskProcessor {
  static async process(job: Job): Promise<Activity> {
    return getCustomRepository(ActivityRepository).save(job.data)
  }
}
