import chalk from 'chalk'
import db from '../../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../repositories/tasks/TaskRepository'
import { TaskListRepository } from '../../repositories/tasks/TaskListRepository'

export class BoardIdCommand {
  static async run() {
    await db()

    try {
      await BoardIdCommand.updateBoardIds()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async updateBoardIds() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Updating board IDs...'))

    const tasks = await getCustomRepository(TaskRepository).find()

    for (const task of tasks) {
      const taskList = await getCustomRepository(TaskListRepository).findOne(task.listId)

      task.boardId = taskList.boardId
    }

    await getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
