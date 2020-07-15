import { Message } from './message'
import { User } from '../../database/entities/User'

export class NodeMessage extends Message {
  constructor(from: User, content: string) {
    super(from, content)
  }
}