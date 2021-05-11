import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { NodeRepository } from '../../database/repositories/NodeRepository'
import { NodeType, NodeTypeEntityNameMap } from '../../shared/constants'
import { ContentAccessRepository } from '../../database/repositories/ContentAccessRepository'
import { ContentAccess } from '../../database/entities/ContentAccess'
import { ContentAccessType } from '../../services/content-access/ContentAccessType'

export class CreateContentAccess {
  static async run() {
    await db()

    try {
      await CreateContentAccess.execute()
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
    console.log(chalk.yellow('Create content access table entries for nodes...'))

    const nodes = await getCustomRepository(NodeRepository)
      .createQueryBuilder('node')
      .where('node.type NOT IN (:...types)', { types: [NodeType.Root, NodeType.Archive, NodeType.Private] })
      .getMany()

    for (const node of nodes) {
      // tslint:disable-next-line:no-console
      console.log(chalk.green(`Processig node id ${node.id} ${node.title}`))

      let contentAccess = await getCustomRepository(ContentAccessRepository)
        .createQueryBuilder('contentAccess')
        .where('contentAccess.nodeId = :nodeId', { nodeId: node.id })
        .getOne()

      if (contentAccess) {
        // tslint:disable-next-line:no-console
        console.log(chalk.greenBright('Found entry in content access table, skip'))
        continue
      }

      contentAccess = new ContentAccess()
      contentAccess.spaceId = node.spaceId
      contentAccess.ownerId = node.userId
      contentAccess.nodeId = node.id
      contentAccess.entityId = node.contentId
      contentAccess.entity = NodeTypeEntityNameMap.get(node.type)
      contentAccess.type = ContentAccessType.Open
      contentAccess.public = false

      contentAccess = await getCustomRepository(ContentAccessRepository).save(contentAccess)
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
