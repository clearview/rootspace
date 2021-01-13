import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository, LessThan } from 'typeorm'
import { SpaceRepository } from '../../database/repositories/SpaceRepository'

export class DeleteCommand {
  static async run(id: number) {
    if (!id || !Number.isInteger(+id)) {
      throw Error('Please enter numerical space ID')
    }

    await db()

    try {
      await DeleteCommand.deleteSpace(id)
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async deleteSpace(id: number) {
    const repository = getCustomRepository(SpaceRepository)
    const space = await repository.findOne(id)

    // tslint:disable-next-line:no-console
    console.log(chalk.yellow(`Deleting space ID: ${id} - ${space.title} ...`))

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
