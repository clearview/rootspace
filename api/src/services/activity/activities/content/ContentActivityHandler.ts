import pug from 'pug'
import { Activity } from '../../../../database/entities/Activity'
import { User } from '../../../../database/entities/User'
import { ServiceFactory } from '../../../factory/ServiceFactory'
import {
  ActivityService,
  UserService,
  MailService,
  UserSettingService,
  FollowService,
  NotificationService,
  EntityService,
} from '../../../'
import { IContentActivityData } from './ContentActivityData'
import { IActivityHandler } from '../ActivityHandler'

export abstract class ContentActivityHandler<T> implements IActivityHandler {
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

  abstract process(): Promise<void>

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

    if (settings.preferences.receiveEmail === undefined || settings.preferences.receiveEmail === true) {
      return true
    }

    return false
  }

  protected async sendNotificationEmail(
    user: User,
    subject: string,
    activity: Activity,
    entityUrl: string,
    notificationContent?: string
  ): Promise<void> {
    const content = pug.renderFile(ContentActivityHandler.mailTemplate(activity), {
      activity,
      entityUrl,
      notificationContent,
    })
    await this.mailService.sendMail(user.email, subject, content)
  }

  private static mailTemplate(activity: Activity): string {
    return `${process.cwd()}/src/templates/mail/notification/${activity.entity.toLowerCase()}/${activity.action.toLowerCase()}.pug`
  }
}
