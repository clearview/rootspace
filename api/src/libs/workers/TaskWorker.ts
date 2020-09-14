import 'dotenv/config'
import { config } from 'node-config-ts'
import { BaseWorker } from './BaseWorker'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { MailService, TaskService, UserService } from '../../services'
import { TaskActivities } from '../../database/entities/activities/TaskActivities'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { UserSettingService } from '../../services/UserSettingService'
import { User } from '../../database/entities/User'
import pug from 'pug'
import { Task } from '../../database/entities/tasks/Task'

export class TaskWorker extends BaseWorker {
  static mailTemplatesDir = `${process.cwd()}/src/templates/mail/content/`

  private static instance: TaskWorker
  private mailService: MailService
  private userService: UserService
  private taskService: TaskService

  private constructor() {
    super()
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.taskService = TaskService.getInstance()
  }

  static getInstance() {
    if (!TaskWorker.instance) {
      TaskWorker.instance = new TaskWorker()
    }

    return TaskWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {
    await this.emailFollowers(event)
    await this.notifyFollowers(event)

    switch (event.action) {
      case TaskActivities.Created:
        await this.followActivity(event)
        break
      case TaskActivities.Deleted:
        await this.unfollowActivity(event)
        break
      case TaskActivities.Assignee_Added:
        await this.followActivity(event)
        break
      case TaskActivities.Assignee_Removed:
        await this.unfollowActivity(event)
        break
    }
  }

  async emailFollowers(event: ActivityEvent): Promise<void> {
    const followerUserIds = await this.followService.getFollowerIds(event)

    for (const userId of followerUserIds) {
      const shouldReceiveNotification  = await this.followService.shouldReceiveNotification(userId, event)
      if (!shouldReceiveNotification) { break }

      const userSetting = await UserSettingService.getInstance().getSettings(userId, event.spaceId)

      if (userSetting && userSetting.preferences.notifications?.email === true) {
        const user = await this.userService.getUserById(userId)
        await this.sendNotificationEmail(user, event)
      }
    }
  }

  private async sendNotificationEmail(user: User, event: ActivityEvent): Promise<boolean> {
    const task = await this.taskService.getById(event.entityId)
    const taskUrl = `${config.domain}/taskboard/${task.boardId}/item/${task.id}/${task.slug}`

    const subject = await this.emailSubject(event, task)
    const content = pug.renderFile(TaskWorker.mailTemplatesDir + 'modified.pug', { subject, taskUrl })

    await this.mailService.sendMail(user.email, subject, content)

    return true
  }

  private async emailSubject(event: ActivityEvent, task: Task) : Promise<string> {
    const actorId = event.actorId
    const actor = await this.userService.getUserById(actorId)

    let action = ''

    switch (event.action) {
      case TaskActivities.Created:
        action = 'created new task'
        break
      case TaskActivities.Updated:
        action = 'updated task'
        break
      case TaskActivities.Archived:
        action = 'archived task'
        break
      case TaskActivities.Restored:
        action = 'restored task'
        break
      case TaskActivities.Deleted:
        action = 'deleted task'
        break
      case TaskActivities.Assignee_Added:
        action = 'added assignee to task'
        break
      case TaskActivities.Assignee_Removed:
        action = 'removed assignee from task'
        break
      case TaskActivities.Comment_Created:
        action = 'commented on task'
        break
      case TaskActivities.Comment_Updated:
        action = 'updated a comment on task'
        break
      case TaskActivities.Comment_Deleted:
        action = 'deleted a comment from task'
        break
      case TaskActivities.Tag_Added:
        action = 'added new tag to task'
        break
      case TaskActivities.Tag_Removed:
        action = 'removed tag from task'
        break
    }

    return `Root, ${actor.fullName()} ${action} ${task.title}`
  }
}