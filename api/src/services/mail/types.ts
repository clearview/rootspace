export interface MailClientInterface<T> {
    sendMail(to: string, subject: string, content: string): Promise<any>
}