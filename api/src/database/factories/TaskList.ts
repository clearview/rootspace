import * as Faker from 'faker'
import {define, times} from 'typeorm-seeding'
import { TaskList } from '../../entities/TaskList'

define(TaskList, (faker: typeof Faker) => {

  const taskList = new TaskList()
  taskList.title = faker.name.jobTitle()
  taskList.description = faker.name.jobDescriptor()

  return taskList
})