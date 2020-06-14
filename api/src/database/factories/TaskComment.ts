import * as Faker from 'faker'
import {define} from 'typeorm-seeding'
import {TaskComment} from '../../entities/tasks/TaskComment'

define(TaskComment, (faker: typeof Faker) => {

  const taskComment = new TaskComment()
  taskComment.content = faker.lorem.sentence()
  taskComment.createdAt = faker.date.recent(7)

  return taskComment
})