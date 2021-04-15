import { config } from 'node-config-ts'
import { TaskBoard } from '../../../../database/entities/tasks/TaskBoard'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './ContentActivityData'
import { ContentActions } from './actions'

export class TaskBoardActivityHandler extends ContentActivityHandler<TaskBoard> {
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
    let follows = await this.followService.getFollowsForTaskBoard(this.entity.id)

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
    const entityUrl = `${config.domain}/taskboard/${this.entity.id}`
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
      [ContentActions.Created]: `${actor.fullName()} created task board ${title}}`,
      [ContentActions.Updated]: `${actor.fullName()} updated task board ${title}`,
      [ContentActions.Archived]: `${actor.fullName()} archived task board ${title}`,
      [ContentActions.Restored]: `${actor.fullName()} restored task board ${title}`,
      [ContentActions.Deleted]: `${actor.fullName()} deleted task board ${title}`,
    }

    if (messages.hasOwnProperty(this.activity.action)) {
      return messages[this.activity.action]
    }

    return `${actor.fullName()} updated task list ${title}`
  }
}
