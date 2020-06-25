import * as Faker from 'faker'
import { define, factory, times } from 'typeorm-seeding'
import { TaskList } from '../../entities/tasks/TaskList'
import { TaskBoard } from '../../entities/tasks/TaskBoard'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'

define(TaskList, (faker: typeof Faker, context: any) => {

  const taskList = new TaskList()
  taskList.title = faker.name.jobTitle()
  taskList.description = faker.name.jobDescriptor()
  taskList.user = context.user ? context.user : factory(User)() as any
  taskList.space = context.space ? context.space : factory(Space)() as any
  taskList.board = context.board ? context.board : factory(TaskBoard)() as any

  return taskList
})