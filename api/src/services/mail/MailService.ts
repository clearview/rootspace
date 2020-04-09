import { SendGridClient } from "./SendGridClient";

export class MailService {
  sendMail(to: string, subject: string, content: string): Promise<any> {
    const service = new SendGridClient();
    return service.sendMail(to, subject, content);
  }
}
