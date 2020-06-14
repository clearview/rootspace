import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { TaskBoard, TaskBoardType } from '../../entities/tasks/TaskBoard'

define(TaskBoard, (faker: typeof Faker) => {

  const taskBoard = new TaskBoard()
  taskBoard.type = TaskBoardType.List
  taskBoard.isPublic = false
  taskBoard.title = faker.company.companyName()
  taskBoard.description = faker.lorem.sentence()

  return taskBoard
})