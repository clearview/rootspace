import { config } from 'node-config-ts'
import pug from 'pug'
import { MailService, UserService } from '../../..'
import { ServiceFactory } from '../../../factory/ServiceFactory'
import { IActivityData } from '../ActivityData'
import { IActivityHandler } from '../ActivityHandler'

const mailTemplatesDir = `${process.cwd()}/src/templates/mail/user/`

export class PasswordResetHandler implements IActivityHandler {
  private mailService: MailService
  private userService: UserService

  private data: IActivityData

  constructor(data: IActivityData) {
    this.mailService = ServiceFactory.getInstance().getMailService()
    this.userService = ServiceFactory.getInstance().getUserService()

    this.data = data
  }

  async process(): Promise<void> {
    await this.sendPasswordResetMail()
  }

  private async sendPasswordResetMail(): Promise<void> {
    const passwordReset = await this.userService.getPasswordResetById(this.data.entityId)

    const subject = 'Root, Password reset'

    let confirmUrl = config.domain + config.domainPasswordResetPath
    confirmUrl = `${confirmUrl}/${passwordReset.token}?${passwordReset.urlQueryParams}`

    const content = pug.renderFile(mailTemplatesDir + 'passwordReset.pug', {
      passwordReset,
      confirmUrl,
    })

    await this.mailService.sendMail(passwordReset.email, subject, content)
  }
}
