import chalk from 'chalk'
import db from '../db'
import { getConnection, getCustomRepository, UpdateResult } from 'typeorm'
import { LinkRepository } from '../repositories/LinkRepository'
import { Node } from '../entities/Node'
import { NodeRepository } from '../repositories/NodeRepository'

export class NodeCommand {
  async run(command: string) {
    await db()

    try {
      switch (command) {
        case 'normalize-positions':
          await this.normalizePositions()
          break
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private async normalizePositions() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Normalize positions...'))

    await NodeCommand.setRootPositions()

    const parents = await getCustomRepository(LinkRepository)
      .createQueryBuilder('node')
      .select(['node.parentId'])
      .distinctOn(['node.parentId'])
      .where('node.type != :type', { type: 'root' })
      .getRawMany()

    await Promise.all(
      parents.map(
        async function(parent: any) {
          return this.setPositions(parent.node_parentId)
        }.bind(this)
      )
    )
  }

  private static async setRootPositions(): Promise<UpdateResult> {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Set space root links positions to 0'))

    return getCustomRepository(NodeRepository)
      .createQueryBuilder()
      .update()
      .set({
        position: 0,
      })
      .where('type = :type', { type: 'root' })
      .execute()
  }

  private async setPositions(parentId: number) {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Set positions for parent id ' + parentId))

    const links = await getCustomRepository(NodeRepository)
      .createQueryBuilder('node')
      .where('node.parentId = :parentId', { parentId })
      .orderBy('node.position')
      .orderBy('created')
      .getMany()

    let position = 1

    return Promise.all(
      links.map(async (link: Node) => {
        link.position = position++
        return getCustomRepository(NodeRepository).save(link)
      })
    )
  }
}
