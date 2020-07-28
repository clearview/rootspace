import { Job } from 'bull'

export class TaskProcessor {
  static async process(job: Job): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(`Processing task job ${job.id}`)

    return null
  }
}
