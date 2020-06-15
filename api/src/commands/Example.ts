import chalk from 'chalk'
import db from '../db'
import {getConnection} from 'typeorm'
import { TaskService } from '../services'

class Example {
  async run (command) {
    // tslint:disable-next-line:no-console
    console.log(command)

    await db()
    // tslint:disable-next-line:no-console
    console.log('Db connected')

    try {
      switch (command) {
        case 'select':
          await this.dbOperation()
          break

        case 'update':
          // tslint:disable-next-line:no-console
          console.log(chalk.yellow('Running example command update...'))
          break
      }

      // tslint:disable-next-line:no-console
      console.log(chalk.green('Example operation complete'))
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Example operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  async dbOperation() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Processing select...'))

    const task = await TaskService.getInstance().getById(1)
    // tslint:disable-next-line:no-console
    console.log(chalk.green(`Got task: ${task.title}`))
  }
}

const exampleCommand = new Example()
export { exampleCommand }
