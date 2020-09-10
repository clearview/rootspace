import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository, LessThan } from 'typeorm'
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
    const yesterday = moment().subtract(1, 'days')

    const repository = getCustomRepository(TaskRepository)
    const tasks = await repository.find(
      {
        isOverdue: false,
        dueDate: LessThan(yesterday)
      })

    for (const task of tasks) {
      task.isOverdue = OverdueCommand.isOverdue(task)
    }

    await getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }

  private static isOverdue(task: Task): boolean {
    const now = moment()
    const dueDate = moment(task.dueDate)

    return dueDate < now
  }
}
