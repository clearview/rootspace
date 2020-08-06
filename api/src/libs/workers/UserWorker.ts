import 'dotenv/config'
import { config } from 'node-config-ts'
import { ActivityEvent } from '../../services/events/ActivityEvent'
import { MailService, UserService } from '../../services'
import { ServiceFactory } from '../../services/factory/ServiceFactory'
import { UserActivities } from '../../database/entities/activities/UserActivities'
import pug from 'pug'

export class UserWorker {
  static mailTemplatesDir = `${process.cwd()}/src/templates/mail/user/`

  private static instance: UserWorker
  private mailService: MailService
  private userService: UserService

  private constructor() {
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()
  }

  static getInstance(): UserWorker {
    if (!UserWorker.instance) {
      UserWorker.instance = new UserWorker()
    }

    return UserWorker.instance
  }

  async process(event: ActivityEvent): Promise<void> {

    switch (event.action) {
      case UserActivities.Signup:
        await this.sendConfirmationEmail(event)
        break
      case UserActivities.Email_Confirmed:
        await this.sendWelcomeEmail(event)
        break
      case UserActivities.Login_Failed:
        await this.sendLoginFailedEmail(event)
        break
    }
  }

  private async sendConfirmationEmail(event: ActivityEvent): Promise<boolean> {
    const userId = event.actorId
    const user = await this.userService.getUserById(userId, ['token'])

    const subject = 'Root, email confirmation'
    const confirmationURL = config.domain + config.domainEmailConfirmationPath
    const confirmUrl = `${confirmationURL}/${user.token}/${user.id}`

    const content = pug.renderFile(UserWorker.mailTemplatesDir + 'confirmEmail.pug', { user, confirmUrl })

    try {
      await this.mailService.sendMail(user.email, subject, content)
    } catch (error) {
      return false
    }

    return true
  }

  private async sendWelcomeEmail(event: ActivityEvent): Promise<boolean> {
    const userId = event.actorId
    const user = await this.userService.getUserById(userId, ['token'])

    const subject = 'Welcome to Root!'
    const content = pug.renderFile(UserWorker.mailTemplatesDir + 'welcome.pug')

    try {
      await this.mailService.sendMail(user.email, subject, content)
    } catch (error) {
      return false
    }

    return true
  }

  private async sendLoginFailedEmail(event: ActivityEvent): Promise<boolean> {
    const userId = event.actorId
    const user = await this.userService.getUserById(userId)

    const subject = 'Root, login failed'
    const content = pug.renderFile(UserWorker.mailTemplatesDir + 'loginFailed.pug')

    try {
      await this.mailService.sendMail(user.email, subject, content)
    } catch (error) {
      return false
    }

    return true
  }
}