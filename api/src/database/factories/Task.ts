import * as Faker from 'faker'
import {define} from 'typeorm-seeding'
import {Task, TaskStatus} from '../../entities/Task'

define(Task, (faker: typeof Faker) => {

  const task = new Task()
  task.title = faker.lorem.lines(1)
  task.description = faker.lorem.sentence()
  task.status = faker.random.boolean() === true ? TaskStatus.Closed : TaskStatus.Open

  return task
})