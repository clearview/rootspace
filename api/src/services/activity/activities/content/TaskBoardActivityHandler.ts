import 'dotenv/config'
import { TaskBoard } from '../../../../database/entities/tasks/TaskBoard'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'
import { ContentActions } from './actions'

export class TaskBoardActivityHandler extends ContentActivityHandler<TaskBoard> {
  private constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()

    switch (this.activity.action) {
      case ContentActions.Deleted:
        await this.contentDeleted()
        break
    }
  }

  protected async contentDeleted(): Promise<void> {
    await this.followService.removeFollowsForTaskBoard(this.activity.entityId)
  }
}
