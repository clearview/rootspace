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
    const actorId = event.actorId
    const actor = await this.userService.getUserById(actorId)
    const task = await this.taskService.getById(event.entityId)

    const subject = `Root, ${actor.fullName()} modified task ${task.title}`
    const taskUrl = `${config.domain}/`

    const content = pug.renderFile(
      TaskWorker.mailTemplatesDir + 'modified.pug',
      { actor, event, task, taskUrl }
    )

    await this.mailService.sendMail(user.email, subject, content)

    return true
  }
}