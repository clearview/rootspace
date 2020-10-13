import 'dotenv/config'
import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'

export class TaskListActivityHandler extends ContentActivityHandler<TaskList> {
  constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()
  }
}
