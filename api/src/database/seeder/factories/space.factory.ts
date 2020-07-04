import * as Faker from 'faker'
import { define, factory } from 'typeorm-seeding'
import { Space } from '../../entities/Space'
import { User } from '../../entities/User'

define(Space, (faker: typeof Faker) => {
  const space = new Space()
  space.userId = 0
  space.title = faker.commerce.department()
  space.active = true
  return space
})