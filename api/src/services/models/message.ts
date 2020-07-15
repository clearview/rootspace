import { User } from '../../database/entities/User'

export class Message {
  constructor(private from: User, private message: string) {}
}