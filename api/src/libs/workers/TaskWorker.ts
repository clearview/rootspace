import 'dotenv/config'
import { config } from 'node-config-ts'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { FollowService, MailService, TaskService, UserService } from '../../services'
import { TaskActivities } from '../../database/entities/activities/TaskActivities'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { Follow } from '../../database/entities/Follow'
import { Notification } from '../../database/entities/Notification'
import { DeleteResult } from 'typeorm/index'
import pug from 'pug'
import { UserSettingService } from '../../services/UserSettingService'
import { User } from '../../database/entities/User'

export class TaskWorker {
  static mailTemplatesDir = `${process.cwd()}/src/templates/mail/content/`

  private static instance: TaskWorker
  private followService: FollowService
  private mailService: MailService
  private userService: UserService
  private taskService: TaskService

  private constructor() {
    this.followService = ServiceFactory.getInstance().getFollowService()
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
    await this.notifyFollowers(event)
    await this.emailFollowers(event)

    switch (event.action) {
      case TaskActivities.Created:
        await this.followActivity(event)
        break
      case TaskActivities.Deleted:
        await this.unfollowActivity(event)
        break
    }
  }

  async followActivity(event: ActivityEvent): Promise<Follow> {
    return this.followService.followFromActivity(event)
  }

  async unfollowActivity(event: ActivityEvent): Promise<void | DeleteResult> {
    return this.followService.removeFollowsFromActivity(event)
  }

  async notifyFollowers(event: ActivityEvent): Promise<Notification[]> {
    return this.followService.createNotifications(event)
  }

  async emailFollowers(event: ActivityEvent): Promise<void> {
    const follows = await this.followService.getFollows(event)
    const userIds = follows.map((follow) => follow.userId)

    for (const userId of userIds) {
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