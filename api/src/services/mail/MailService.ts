import { SendGridClient } from './SendGridClient'
import { MailhogClient } from './MailhogClient'
import {MailClientInterface} from './types'

export class MailService {
  sendMail(to: string, subject: string, content: string): Promise<any> {

    let service: MailClientInterface<any>

    switch (process.env.NODE_ENV) {
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
