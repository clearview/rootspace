import * as Faker from 'faker'
import { define, factory } from 'typeorm-seeding'
import { Task, TaskStatus } from '../../entities/tasks/Task'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'
import { TaskList } from '../../entities/tasks/TaskList'

define(Task, (faker: typeof Faker, context: any) => {
  const task = new Task()
  task.title = faker.lorem.lines(1)
  task.description = faker.lorem.sentence()
  task.status = faker.random.boolean() === true ? TaskStatus.Closed : TaskStatus.Open
  task.dueDate = faker.random.boolean() === true ? faker.date.future(1) : null
  task.user = context.user ? context.user : factory(User)() as any
  task.space = context.space ? context.space : factory(Space)() as any
  task.list = context.list ? context.list : factory(TaskList)() as any

  task.tags = []

  return task
})