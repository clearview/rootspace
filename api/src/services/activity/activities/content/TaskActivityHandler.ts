import pug from 'pug'
import 'dotenv/config'
import { config } from 'node-config-ts'
import { User } from '../../../../database/entities/User'
import { Task } from '../../../../database/entities/tasks/Task'
import { Activity } from '../../../../database/entities/Activity'
import { ServiceFactory } from '../../../../services/factory/ServiceFactory'
import { MailService, TaskService, UserService, UserSettingService } from '../../../'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'
import { ContentActions, TaskActions } from './actions'

export class TaskActivityHandler extends ContentActivityHandler<Task> {
  private mailTemplatesDir = `${process.cwd()}/src/templates/mail/content/`

  private mailService: MailService
  private userService: UserService
  private taskService: TaskService

  private constructor(data: IContentActivityData) {
    super(data)

    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.taskService = TaskService.getInstance()
  }

  async process(): Promise<void> {
    await this.init()

    await this.emailFollowers()
    await this.notifyFollowers()

    switch (this.activity.action) {
      case ContentActions.Created:
        await this.followActivity()
        break
      case ContentActions.Deleted:
        await this.unfollowActivity()
        break
      case TaskActions.Assignee_Added:
        await this.processAssigneeAdded()
        break
      case TaskActions.Assignee_Removed:
        await this.unfollowActivity()
        break
    }
  }

  protected async processAssigneeAdded() {
    const context: any = this.activity.context
    const assigneeId = context.assignee.id

    this.followActivity(assigneeId)
  }

  async emailFollowers(): Promise<void> {
    const follows = await this.followService.getFollowsForActivity(this.activity)

    for (const follow of follows) {
      const shouldReceiveNotification = await this.followService.shouldReceiveNotification(follow.userId, this.activity)

      if (!shouldReceiveNotification) {
        //continue
      }

      const userSetting = await UserSettingService.getInstance().getSettings(follow.userId, this.activity.spaceId)

      if ((userSetting && userSetting.preferences.notifications?.email === true) || 1) {
        const user = await this.userService.getUserById(follow.userId)
        await this.sendNotificationEmail(user, this.activity)
      }
    }
  }

  private async sendNotificationEmail(user: User, event: Activity): Promise<boolean> {
    const task = await this.taskService.getById(event.entityId)
    const taskUrl = `${config.domain}/taskboard/${task.boardId}/item/${task.id}/${task.slug}`

    const subject = await this.emailSubject(event, task)
    const content = pug.renderFile(this.mailTemplatesDir + 'modified.pug', { subject, taskUrl })

    await this.mailService.sendMail(user.email, subject, content)

    return true
  }

  private async emailSubject(event: Activity, task: Task): Promise<string> {
    const actorId = event.actorId
    const actor = await this.userService.getUserById(actorId)

    let action = ''

    switch (event.action) {
      case ContentActions.Created:
        action = 'created new task'
        break
      case ContentActions.Updated:
        action = 'updated task'
        break
      case ContentActions.Archived:
        action = 'archived task'
        break
      case ContentActions.Restored:
        action = 'restored task'
        break
      case ContentActions.Deleted:
        action = 'deleted task'
        break
      case TaskActions.List_Moved:
        action = 'moved taks'
        break
      case TaskActions.Assignee_Added:
        action = 'added assignee to task'
        break
      case TaskActions.Assignee_Removed:
        action = 'removed assignee from task'
        break
      case TaskActions.Comment_Created:
        action = 'commented on task'
        break
      case TaskActions.Tag_Added:
        action = 'added new tag to task'
        break
      case TaskActions.Tag_Removed:
        action = 'removed tag from task'
        break
    }

    return `Root, ${actor.fullName()} ${action} ${task.title}`
  }
}
