import 'dotenv/config'
import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'
import { ContentActions } from './actions'


export class TaskListActivityHandler extends ContentActivityHandler<TaskList> {
  private constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()

    switch (this.activity.action) {
      case ContentActions.Deleted:
        await this.unfollowTasks()
        break
    }
  }

  async unfollowTasks(): Promise<void> {
    return this.followService.removeFollowsForTaskBoardList(this.activity)
  }
}
