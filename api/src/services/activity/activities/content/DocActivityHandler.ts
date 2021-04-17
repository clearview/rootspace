import { config } from 'node-config-ts'
import { Doc } from '../../../../database/entities/Doc'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './ContentActivityData'
import { ContentActions } from './actions'

export class DocActivityHandler extends ContentActivityHandler<Doc> {
  constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()

    await this.processAction()
    await this.processNotifications()
  }

  private async processAction() {
    switch (this.activity.action) {
      case ContentActions.Created:
        await this.createFollows()
        break
      case ContentActions.Updated:
        await this.createFollows()
        break
      case ContentActions.Deleted:
        await this.removeFollows()
        break
    }
  }

  private async processNotifications(): Promise<void> {
    if (this.activity.action === ContentActions.Deleted) {
      return
    }

    await this.createNotificationEntries()
    await this.sendEmailNotifications()
  }

  private async sendEmailNotifications(): Promise<void> {
    const entityUrl = `${config.domain}/document/${this.entity.id}/${this.entity.slug}`
    const follows = await this.followService.getFollowsForActivity(this.activity)

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
      [ContentActions.Created]: `${actor.fullName()} created document [${title}]`,
      [ContentActions.Updated]: `${actor.fullName()} updated document [${title}]`,
      [ContentActions.Archived]: `${actor.fullName()} archived document [${title}]`,
      [ContentActions.Restored]: `${actor.fullName()} restored document [${title}]`,
      [ContentActions.Deleted]: `${actor.fullName()} deleted document [${title}]`,
    }

    if (messages.hasOwnProperty(this.activity.action)) {
      return messages[this.activity.action]
    }

    return `${actor.fullName()} updated document [${title}]`
  }
}
