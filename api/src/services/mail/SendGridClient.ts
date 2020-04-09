import { config } from "node-config-ts";
import sgMail from "@sendgrid/mail";

export class SendGridClient {
  sendMail(to: string, subject: string, content: string): Promise<any> {
    sgMail.setApiKey(config.mail.sendgrid.api_key);

    const msg = {
      to: to,
      from: config.mail.from,
      subject: subject,
      text: content,
      html: content,
    };

    return sgMail.send(msg);
  }
}
