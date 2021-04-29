import * as faker from 'faker'
import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { SeederBase } from '../base/SeederBase'
import { TaskBoard } from '../../entities/tasks/TaskBoard'
import { Tag } from '../../entities/tasks/Tag'
import { TaskList } from '../../entities/tasks/TaskList'
import { Task } from '../../entities/tasks/Task'
import { TaskComment } from '../../entities/tasks/TaskComment'
import { Node } from '../../entities/Node'
import { NodeType } from '../../../shared/constants'

export default class TasksSeeder implements Seeder {
  protected base: SeederBase

  public async run(factory: Factory, connection: Connection): Promise<any> {
    this.base = await SeederBase.create(factory)

    const taskBoards = await this.createTaskBoard(3)
    for (const taskBoard of taskBoards) {
      taskBoard.tags = await this.base
        .factory(Tag)({ board: taskBoard })
        .createMany(faker.random.number(10))

      const taskLists = await this.createTaskList(taskBoard, 3)

      for (const taskList of taskLists) {
        const tasks = await this.createTasks(taskList, 3)

        for (const task of tasks) {
          await this.createTaskComments(task, faker.random.number(3))
        }
      }
    }
  }

  async createTaskBoard(count: number): Promise<TaskBoard[]> {
    const taskBoards = await this.base
      .factory(TaskBoard)({
        user: this.base.user,
        space: this.base.space,
      })
      .createMany(count)

    for (const taskBoard of taskBoards) {
      await this.base
        .factory(Node)()
        .create({
          userId: this.base.user.id,
          spaceId: this.base.space.id,
          contentId: taskBoard.id,
          title: taskBoard.title,
          type: NodeType.TaskBoard,
          parent: this.base.rootNode,
        })
    }

    return taskBoards
  }

  async createTaskList(
    taskBoard: TaskBoard,
    count: number
  ): Promise<TaskList[]> {
    return this.base
      .factory(TaskList)({
        user: this.base.user,
        space: this.base.space,
        board: taskBoard,
      })
      .createMany(count)
  }

  async createTasks(taskList: TaskList, count: number): Promise<Task[]> {
    return this.base
      .factory(Task)({
        user: this.base.user,
        space: this.base.space,
        board: taskList.board,
        list: taskList,
      })
      .map(async (task: Task) => {
        const taskBoard = taskList.board
        if (taskBoard.tags.length > 0) {
          task.tags = taskBoard.tags
            .sort(() => 0.5 - Math.random())
            .slice(0, faker.random.number(taskBoard.tags.length))
        }

        return task
      })
      .createMany(count)
  }

  async createTaskComments(task: Task, count: number): Promise<TaskComment[]> {
    return this.base
      .factory(TaskComment)()
      .map(async (taskComment: TaskComment) => {
        taskComment.user = this.base.user
        taskComment.task = task
        return taskComment
      })
      .createMany(count)
  }
}
