import { TaskBoard } from '../../../../database/entities/tasks/TaskBoard'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'

export class TaskBoardActivityHandler extends ContentActivityHandler<TaskBoard> {
  constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()
  }
}
