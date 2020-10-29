import pug from 'pug'
import { Activity } from '../../../../database/entities/Activity'
import { User } from '../../../../database/entities/User'
import { ServiceFactory } from '../../../factory/ServiceFactory'
import { FollowService, NotificationService, EntityService } from '../../../'
import { IContentActivityHandler, IContentActivityData } from './types'
import { ActivityService, UserService, MailService, UserSettingService } from '../../../index'

export abstract class ContentActivityHandler<T> implements IContentActivityHandler {
  protected mailTemplate = `${process.cwd()}/src/templates/mail/notification/content.pug`

  protected activityService: ActivityService
  protected userService: UserService
  protected userSettingsService: UserSettingService
  protected followService: FollowService
  protected notificationService: NotificationService
  protected entityService: EntityService
  protected mailService: MailService

  protected data: IContentActivityData
  protected activity: Activity
  protected entity: T

  constructor(data: IContentActivityData) {
    this.activityService = ServiceFactory.getInstance().getActivityService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.userSettingsService = ServiceFactory.getInstance().getUserSettingService()
    this.followService = ServiceFactory.getInstance().getFollowService()
    this.notificationService = NotificationService.getInstance()
    this.entityService = ServiceFactory.getInstance().getEntityService()
    this.mailService = ServiceFactory.getInstance().getMailService()

    this.data = data
  }

  protected async init() {
    this.activity = await this.activityService.getById(this.data.activityId)

    this.entity = await this.entityService.getEntityByNameAndId<T>(this.activity.entity, this.activity.entityId, {
      withDeleted: true,
    })
  }

  abstract async process(): Promise<void>

  protected getFollows() {
    return this.followService.getFollowsForActivity(this.activity)
  }

  protected async createFollows(): Promise<void> {
    await this.followService.followEntity(this.activity.actorId, this.entity)
  }

  protected async removeFollows(): Promise<void> {
    await this.followService.deleteByEntityAndEntityId(this.activity.entity, this.activity.entityId)
  }

  protected async createNotificationEntries(): Promise<void> {
    const follows = await this.getFollows()

    for (const follow of follows) {
      await this.notificationService.create(this.activity, follow.userId)
    }
  }

  protected async userEmailNotifications(userId: number) {
    const settings = await this.userSettingsService.getSettings(userId, this.activity.spaceId)

    if (!settings) {
      return true
    }

    if (settings.preferences.notifications?.email === true || 1) {
      return true
    }

    return false
  }

  protected async sendNotificationEmail(user: User, message: string, entityUrl: string): Promise<void> {
    const content = pug.renderFile(this.mailTemplate, { message, entityUrl })
    await this.mailService.sendMail(user.email, message, content)
  }
}
