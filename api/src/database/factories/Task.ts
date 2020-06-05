import * as Faker from 'faker'
import {define} from 'typeorm-seeding'
import {Task, TaskStatus} from '../../entities/Task'

define(Task, (faker: typeof Faker) => {

  const tags = []

  for(let i = 0; i < faker.random.number(3); i++){
    tags.push(faker.hacker.noun())
  }

  const task = new Task()
  task.title = faker.lorem.lines(1)
  task.description = faker.lorem.sentence()
  task.status = faker.random.boolean() === true ? TaskStatus.Closed : TaskStatus.Open
  task.tags = tags
  task.dueDate = faker.random.boolean() === true ? faker.date.future(1) : null

  return task
})