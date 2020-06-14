import { config } from 'node-config-ts'
import {MailClientInterface} from './types'
import nodemailer from 'nodemailer'

export class MailhogClient implements MailClientInterface<any> {
  sendMail(to: string, subject: string, content: string): Promise<any> {
    const mailhog = nodemailer.createTransport({
      host: 'mailhog',
      port: '1025'
    })

    const msg = {
      from: config.mail.from,
      to,
      subject,
      text: content,
      html: content,
    }

    return mailhog.sendMail(msg)
  }
}
