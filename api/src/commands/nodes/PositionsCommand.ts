import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository, UpdateResult } from 'typeorm'
import { NodeRepository } from '../../database/repositories/NodeRepository'
import { Node } from '../../database/entities/Node'

export class PositionsCommand {
  static async run() {
    await db()

    try {
      await PositionsCommand.normalizePositions()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async normalizePositions() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Normalize positions...'))

    await PositionsCommand.setRootPositions()

    const parents = await getCustomRepository(NodeRepository)
      .createQueryBuilder('node')
      .select(['node.parentId'])
      .distinctOn(['node.parentId'])
      .where('node.type != :type', { type: 'root' })
      .getRawMany()

    await Promise.all(
      parents.map(
        async (parent: any) => {
          return PositionsCommand.setPositions(parent.node_parentId)
        }
      )
    )

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }

  private static async setRootPositions(): Promise<UpdateResult> {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Set spaces root nodes positions to 0'))

    return getCustomRepository(NodeRepository)
      .createQueryBuilder()
      .update()
      .set({
        position: 0,
      })
      .where('type = :type', { type: 'root' })
      .execute()
  }

  private static async setPositions(parentId: number) {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Set positions for parent id ' + parentId))

    const nodes = await getCustomRepository(NodeRepository)
      .createQueryBuilder('node')
      .where('node.parentId = :parentId', { parentId })
      .orderBy('node.position')
      .orderBy('created')
      .getMany()

    let position = 1

    return Promise.all(
      nodes.map(async (node: Node) => {
        node.position = position++
        return getCustomRepository(NodeRepository).save(node)
      })
    )
  }
}
