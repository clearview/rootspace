import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Link } from '../../entities/Link'

define(Link, (faker: typeof Faker) => {
  const link = new Link()
  link.userId = 1
  link.spaceId = 1
  link.title = faker.commerce.productName()
  link.type = 'doc'
  link.value = 'https://clearview.team'
  return link
})