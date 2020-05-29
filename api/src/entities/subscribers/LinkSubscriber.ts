import {
  EntitySubscriberInterface,
  InsertEvent,
  EventSubscriber,
  getCustomRepository,
} from 'typeorm'
import { Link } from '../Link'
import { LinkRepository } from '../../repositories/LinkRepository'

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Link> {
  listenTo() {
    return Link
  }

  async beforeInsert(event: InsertEvent<Link>) {
    const link = event.entity

    let position = await getCustomRepository(
      LinkRepository
    ).getMaxPositionByParentId(link.parentId)

    link.position = ++position
  }
}
