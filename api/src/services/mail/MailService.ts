import { config } from 'node-config-ts'
import { SendGridClient } from './SendGridClient'
import { MailhogClient } from './MailhogClient'
import { MailClientInterface } from './types'

export class MailService {

  private constructor() {}

  private static instance: MailClientInterface<any>

  static getInstance() {
    if (!MailService.instance) {
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

      MailService.instance = service
    }

    return MailService.instance
  }

  async sendMail(to: string, subject: string, content: string): Promise<any> {
    return MailService.instance.sendMail(to, subject, content)
  }
}
