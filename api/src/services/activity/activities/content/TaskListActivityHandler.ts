import { config } from 'node-config-ts'
import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'
import { ContentActions } from './actions'

export class TaskListActivityHandler extends ContentActivityHandler<TaskList> {
  constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()

    await this.processAction()
    await this.processNotifications()
  }

  private async processAction(): Promise<void> {
    return
  }

  protected async getFollows() {
    let follows = await this.followService.getFollowsForTaskList(this.entity.id)

    follows = follows.filter((follow) => {
      return follow.userId !== this.activity.actorId
    })

    return follows
  }

  private async processNotifications(): Promise<void> {
    if (this.activity.action === ContentActions.Deleted) {
      return
    }

    await this.createNotificationEntries()
    await this.sendEmailNotifications()
  }

  private async sendEmailNotifications(): Promise<void> {
    const entityUrl = `${config.domain}/taskboard/${this.entity.boardId}`
    const follows = await this.getFollows()

    for (const follow of follows) {
      if ((await this.userEmailNotifications(follow.userId)) === true) {
        const user = await this.userService.getUserById(follow.userId)
        const message = this.getNotificationMessage()

        await this.sendNotificationEmail(user, message, entityUrl)
      }
    }
  }

  private getNotificationMessage(): string {
    const actor = this.activity.actor
    const context = this.activity.context as any
    const title = context.entity.title

    const messages = {
      [ContentActions.Created]: `${actor.fullName()} created task list ${title}}`,
      [ContentActions.Updated]: `${actor.fullName()} updated task list ${title}`,
      [ContentActions.Archived]: `${actor.fullName()} archived task list ${title}`,
      [ContentActions.Restored]: `${actor.fullName()} restored task list ${title}`,
      [ContentActions.Deleted]: `${actor.fullName()} deleted task list ${title}`,
    }

    if (messages.hasOwnProperty(this.activity.action)) {
      return messages[this.activity.action]
    }

    return `${actor.fullName()} updated task list ${title}`
  }
}
