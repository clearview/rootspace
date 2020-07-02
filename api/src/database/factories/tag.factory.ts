import * as Faker from 'faker'
import { define, factory } from 'typeorm-seeding'
import { Tag } from '../../entities/tasks/Tag'
import { TaskBoard } from '../../entities/tasks/TaskBoard'

define(Tag, (faker: typeof Faker, context: any) => {
  const tag = new Tag()
  tag.label = faker.lorem.words(faker.random.number({ min: 1, max: 3 }))
  tag.color = faker.internet.color()
  tag.board = context.board ? context.board : factory(TaskBoard)(context.board) as any

  return tag
})