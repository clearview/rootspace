import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Node } from '../../entities/Node'

define(Node, (faker: typeof Faker) => {
  return new Node()
})
