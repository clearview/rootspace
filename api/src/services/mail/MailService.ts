import { SendGridClient } from './SendGridClient'
import { MailhogClient } from './MailhogClient'

export class MailService {
  sendMail(to: string, subject: string, content: string): Promise<any> {
    const service = process.env.NODE_ENV === 'docker' ? new MailhogClient() : new SendGridClient()
    return service.sendMail(to, subject, content)
  }
}
