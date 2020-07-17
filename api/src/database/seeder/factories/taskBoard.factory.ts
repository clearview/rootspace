import * as Faker from 'faker'
import { define, factory } from 'typeorm-seeding'
import { TaskBoard, TaskBoardType } from '../../entities/tasks/TaskBoard'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'

define(TaskBoard, (faker: typeof Faker, context: any) => {
  const taskBoard = new TaskBoard()
  taskBoard.user = context.user ? context.user : factory(User)() as any
  taskBoard.space = context.space ? context.space : factory(Space)() as any
  taskBoard.type = TaskBoardType.Kanban
  taskBoard.isPublic = false
  taskBoard.title = faker.company.companyName()
  taskBoard.description = faker.lorem.sentence()

  return taskBoard
})