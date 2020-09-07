import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository, IsNull, Not } from 'typeorm'
import { TaskRepository } from '../../database/repositories/tasks/TaskRepository'
import { Task } from '../../database/entities/tasks/Task'
import moment from 'moment'

export class OverdueCommand {
  static async run() {
    await db()

    try {
      await OverdueCommand.updateTasks()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async updateTasks() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Updating isOverdue...'))

    const tasks = await getCustomRepository(TaskRepository).find({ isOverdue: false, dueDate: Not(IsNull()) })

    for (const task of tasks) {
      task.isOverdue = OverdueCommand.isOverdue(task)
    }

    await getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }

  private static isOverdue(task: Task): boolean {
    if (!task.dueDate) {
      return false
    }

    const now = moment()
    const dueDate = moment(task.dueDate)

    return dueDate < now
  }
}
