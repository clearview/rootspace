import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { TaskBoard, TaskBoardType } from '../../entities/TaskBoard'

define(TaskBoard, (faker: typeof Faker) => {

  const taskBoard = new TaskBoard()
  taskBoard.userId = 1
  taskBoard.spaceId = 1
  taskBoard.type = TaskBoardType.List
  taskBoard.isPublic = false
  taskBoard.title = faker.company.companyName()
  taskBoard.description = faker.lorem.sentence()

  return taskBoard
})