import { config } from 'node-config-ts'
import { SendGridClient } from './SendGridClient'
import { MailhogClient } from './MailhogClient'
import { MailClientInterface } from './types'

export class MailService {
  async sendMail(to: string, subject: string, content: string): Promise<any> {

    let service: MailClientInterface<any>

    switch (config.env) {
      case 'development':
      case 'docker':
      case 'test':
        service = new MailhogClient()
        break

      default:
        service = new SendGridClient()
        break
    }

    return service.sendMail(to, subject, content)
  }
}
