import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  getCustomRepository,
} from 'typeorm'
import { Node } from '../entities/Node'
import { NodeRepository } from '../repositories/NodeRepository'
import { NodeType } from '../../types/node'

@EventSubscriber()
export class NodeSubscriber implements EntitySubscriberInterface<Node> {
  listenTo() {
    return Node
  }

  async beforeInsert(event: InsertEvent<Node>) {
    const node = event.entity

    if (node.parent) {
      node.position =
        (await getCustomRepository(NodeRepository).getNodeMaxPosition(
          node.parent.id
        )) + 1
    }
  }

  async afterInsert(event: InsertEvent<Node>) {
    if (event.entity.type === NodeType.Folder) {
      const id = event.entity.id
      event.entity.contentId = id

      await event.manager
        .getCustomRepository(NodeRepository)
        .update(id, { contentId: id })
    }
  }
}
