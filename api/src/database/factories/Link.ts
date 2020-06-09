import * as Faker from 'faker'
import {define} from 'typeorm-seeding'
import {Link, LinkType} from '../../entities/Link'

define(Link, (faker: typeof Faker) => {
  const link = new Link()
  link.userId = 1
  link.spaceId = 1
  link.title = 'Placeholder'
  link.type = LinkType.Undefined
  link.value = 'placeholder'

  return link
})