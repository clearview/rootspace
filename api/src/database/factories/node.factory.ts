import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Node } from '../../entities/Node'
import { NodeType } from '../../types/node'

define(Node, (faker: typeof Faker) => {
  const node = new Node()
  node.userId = 1
  node.spaceId = 1
  node.contentId = 1
  node.title = faker.name.title()
  node.type = NodeType.Undefined
  node.parent = null

  return node
})
