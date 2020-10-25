import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { NodeRepository } from '../../database/repositories/NodeRepository'
import { FolderRepository } from '../../database/repositories/FolderRepository'
import { NodeType } from '../../types/node'
import { Folder } from '../../database/entities/Folder'

export class CreateFoldersEntries {
  static async run() {
    await db()

    try {
      await CreateFoldersEntries.execute()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async execute() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Create nodes folders table entries...'))

    const nodes = await getCustomRepository(NodeRepository)
      .createQueryBuilder('node')
      .where('node.type = :type', { type: NodeType.Folder })
      .getMany()

    for (const node of nodes) {
      // tslint:disable-next-line:no-console
      console.log(chalk.green(`Processig node id ${node.id} ${node.type} ${node.title}`))

      let folder = await getCustomRepository(FolderRepository)
        .createQueryBuilder('folder')
        .where('folder.id = :id', { id: node.contentId })
        .getOne()

      if (folder) {
        // tslint:disable-next-line:no-console
        console.log(chalk.greenBright('Found entry in folders table, skip'))
        continue
      }

      folder = new Folder()
      folder.userId = node.userId
      folder.spaceId = node.spaceId
      folder.title = node.title

      folder = await getCustomRepository(FolderRepository).save(folder)

      node.contentId = folder.id

      await getCustomRepository(NodeRepository).save(node)
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
