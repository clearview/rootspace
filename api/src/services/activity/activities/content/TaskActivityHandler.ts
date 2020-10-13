import pug from 'pug'
import 'dotenv/config'
import { config } from 'node-config-ts'
import { User } from '../../../../database/entities/User'
import { Task } from '../../../../database/entities/tasks/Task'
import { ServiceFactory } from '../../../../services/factory/ServiceFactory'
import { MailService, UserService, UserSettingService } from '../../../'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'
import { ContentActions, TaskActions } from './actions'

export class TaskActivityHandler extends ContentActivityHandler<Task> {
  private mailTemplatesDir = `${process.cwd()}/src/templates/mail/notification/`

  private mailService: MailService
  private userService: UserService

  private constructor(data: IContentActivityData) {
    super(data)

    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()
  }

  async process(): Promise<void> {
    await this.init()

    await this.sendEmailNotifications()
    await this.createNotifications()

    switch (this.activity.action) {
      case ContentActions.Created:
        await this.contentCreated()
        break
      case TaskActions.Assignee_Added:
        await this.assigneeAdded()
        break
      case TaskActions.Assignee_Removed:
        await this.assigneeRemoved()
        break
    }
  }

  private async assigneeAdded() {
    const context: any = this.activity.context
    const assigneeId = context.assignee.id

    await this.followService.followEntity(assigneeId, this.entity)
  }

  private async assigneeRemoved() {
    const context: any = this.activity.context
    const assigneeId = context.assignee.id

    await this.followService.unfollowEntity(assigneeId, this.entity)
  }

  async sendEmailNotifications(): Promise<void> {
    const follows = await this.followService.getFollowsForActivity(this.activity)

    for (const follow of follows) {
      const shouldReceiveNotification = await this.followService.shouldReceiveNotification(follow.userId, this.activity)

      if (!shouldReceiveNotification) {
        //continue
      }

      const userSetting = await UserSettingService.getInstance().getSettings(follow.userId, this.activity.spaceId)

      if ((userSetting && userSetting.preferences.notifications?.email === true) || 1) {
        const user = await this.userService.getUserById(follow.userId)
        const message = this.getNotificationMessage()

        await this.sendNotificationEmail(user, message)
      }
    }
  }

  private async sendNotificationEmail(user: User, message: string): Promise<void> {
    const taskUrl = `${config.domain}/taskboard/${this.entity.boardId}/item/${this.entity.id}/${this.entity.slug}`
    const content = pug.renderFile(this.mailTemplatesDir + 'task.pug', { message, taskUrl })

    await this.mailService.sendMail(user.email, message, content)
  }

  private getNotificationMessage(): string {
    const actor = this.activity.actor
    const context = this.activity.context as any
    const title = context.entity.title

    const messages = {
      [ContentActions.Created]: `${actor.fullName()} created task ${title}}`,
      [ContentActions.Updated]: `${actor.fullName()} updated task ${title}`,
      [ContentActions.Archived]: `${actor.fullName()} archived task ${title}`,
      [ContentActions.Restored]: `${actor.fullName()} restored task ${title}`,
      [ContentActions.Deleted]: `${actor.fullName()} deleted task ${title}`,
      [TaskActions.List_Moved]: `${actor.fullName()} moved task ${title} from '${context.fromList?.title}' to '${
        context.toList?.title
      }'`,
      [TaskActions.Comment_Created]: `${actor.fullName()} commented task ${title}`,
      [TaskActions.Assignee_Added]: `${actor.fullName()} assigneed ${context.assignee?.fullNam ?? ''} to task ${title}`,
      [TaskActions.Assignee_Removed]: `${actor.fullName()} removed ${context.assignee?.fullName ??
        ''} from task ${title}`,
      [TaskActions.Tag_Added]: `${actor.fullName()} added tag ${context.tag?.label} to task ${title}`,
      [TaskActions.Tag_Removed]: `${actor.fullName()} removed tag ${context.tag?.label} from task ${title}`,
    }

    if (messages.hasOwnProperty(this.activity.action)) {
      return messages[this.activity.action]
    }

    return `${actor.fullName()} updated task ${title}`
  }
}
