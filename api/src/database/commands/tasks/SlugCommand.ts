import chalk from 'chalk'
import db from '../../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../repositories/tasks/TaskRepository'
import slugify from '@sindresorhus/slugify'

export class SlugCommand {
  static async run() {
    await db()

    try {
      await SlugCommand.updateSlugs()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async updateSlugs() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Updating slugs...'))

    const tasks = await getCustomRepository(TaskRepository).find()

    for (const task of tasks) {
      task.slug = slugify(task.title)
    }

    await getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
