import 'dotenv/config'
import { config } from 'node-config-ts'
import pug from 'pug'

import { MailService, UserService } from '../../../../services'
import { ServiceFactory } from '../../../../services/factory/ServiceFactory'
import { IActivityHandler, IAppActivityData } from '../types'

const mailTemplatesDir = `${process.cwd()}/src/templates/mail/user/`

export class UserSignupHandler implements IActivityHandler {
  private mailService: MailService
  private userService: UserService

  private data: IAppActivityData

  private constructor(data: IAppActivityData) {
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()

    this.data = data
  }

  async process(): Promise<void> {
    await this.sendConfirmationEmail()
  }

  private async sendConfirmationEmail(): Promise<void> {
    const user = await this.userService.getUserById(this.data.actorId, { addSelect: ['token'] })

    const subject = 'Root, email confirmation'

    let confirmUrl = config.domain + config.domainEmailConfirmationPath
    confirmUrl = `${confirmUrl}/${user.token}/${user.id}`

    const content = pug.renderFile(mailTemplatesDir + 'confirmEmail.pug', { user, confirmUrl })

    await this.mailService.sendMail(user.email, subject, content)
  }
}
