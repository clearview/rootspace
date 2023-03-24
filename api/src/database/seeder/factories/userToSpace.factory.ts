import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { UserToSpace } from '../../entities/UserToSpace'

define(UserToSpace, (faker: typeof Faker) => {
  const uts = new UserToSpace()
  uts.userId = 0
  uts.spaceId = 0
  uts.active = true
  return uts
})