import { config } from 'node-config-ts'
import { MailClientInterface } from './types'
import sgMail from '@sendgrid/mail'

export class SendGridClient implements MailClientInterface<any> {
  async sendMail(to: string, subject: string, content: string): Promise<any> {
    sgMail.setApiKey(config.mail.sendgrid.api_key)

    const msg = {
      to,
      from: config.mail.from,
      subject,
      text: content,
      html: content
    }

    return sgMail.send(msg)
  }
}
