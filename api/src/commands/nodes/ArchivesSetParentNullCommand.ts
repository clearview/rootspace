import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { NodeRepository } from '../../database/repositories/NodeRepository'
import { NodeType } from '../../root/constants'

export class ArchivesSetParentNullCommand {
  static async run() {
    await db()

    try {
      await ArchivesSetParentNullCommand.archivesSetParentNull()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async archivesSetParentNull() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Archives Set Parent Null...'))

    const nodes = await getCustomRepository(NodeRepository)
      .createQueryBuilder('node')
      .where('type = :type', { type: NodeType.Archive })
      .getMany()

    for (const node of nodes) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow('Processing archive id ' + node.id + ', space id ' + node.spaceId))

      node.parent = null
      node.position = 0

      await getCustomRepository(NodeRepository).save(node)
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
