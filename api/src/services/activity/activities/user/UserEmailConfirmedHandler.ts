import pug from 'pug'
import { MailService, UserService } from '../../..'
import { ServiceFactory } from '../../../factory/ServiceFactory'
import { IActivityHandler, IAppActivityData } from '../types'

const mailTemplatesDir = `${process.cwd()}/src/templates/mail/user/`

export class UserEmailConfirmedHandler implements IActivityHandler {
  private mailService: MailService
  private userService: UserService

  private data: IAppActivityData

  private constructor(data: IAppActivityData) {
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()

    this.data = data
  }

  async process(): Promise<void> {
    await this.sendWelcomeEmail()
  }

  private async sendWelcomeEmail(): Promise<boolean> {
    const user = await this.userService.getUserById(this.data.actorId, { addSelect: ['token'] })

    const subject = 'Welcome to Root!'
    const content = pug.renderFile(mailTemplatesDir + 'welcome.pug')

    await this.mailService.sendMail(user.email, subject, content)

    return true
  }
}
