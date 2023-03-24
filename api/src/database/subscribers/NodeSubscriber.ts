import { EntitySubscriberInterface, EventSubscriber, InsertEvent, getCustomRepository } from 'typeorm'
import { Node } from '../entities/Node'
import { NodeRepository } from '../repositories/NodeRepository'

@EventSubscriber()
export class NodeSubscriber implements EntitySubscriberInterface<Node> {
  listenTo() {
    return Node
  }

  async beforeInsert(event: InsertEvent<Node>) {
    const node = event.entity

    if (node.parent) {
      node.position = (await getCustomRepository(NodeRepository).countParentChildrens(node.parent.id)) + 1
    }
  }
}
