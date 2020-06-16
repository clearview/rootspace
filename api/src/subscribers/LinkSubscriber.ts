import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  getCustomRepository,
} from 'typeorm'
import { Link } from '../entities/Link'
import { LinkRepository } from '../repositories/LinkRepository'

@EventSubscriber()
export class LinkSubscriber implements EntitySubscriberInterface<Link> {
  listenTo() {
    return Link
  }

  async beforeInsert(event: InsertEvent<Link>) {
    const link = event.entity

    if (link.parent) {
      link.position =
        (await getCustomRepository(LinkRepository).getNodeMaxPosition(
          link.parent.id
        )) + 1
    }
  }
}
