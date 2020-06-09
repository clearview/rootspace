import { EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { Link } from '../Link'

@EventSubscriber()
export class LinkSubscriber implements EntitySubscriberInterface<Link> {
  listenTo() {
    return Link
  }
}
