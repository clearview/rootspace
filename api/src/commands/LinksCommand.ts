import chalk from 'chalk'
import db from '../db'
import { getConnection, getCustomRepository, UpdateResult } from 'typeorm'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'

export class LinksCommand {
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

    await this.setRootPositions()

    const parents = await getCustomRepository(LinkRepository)
      .createQueryBuilder('link')
      .select(['link.parentId'])
      .distinctOn(['link.parentId'])
      .where('link.type != :type', { type: 'root' })
      .getRawMany()

    await Promise.all(
      parents.map(
        async function(parent: any) {
          return this.setPositions(parent.link_parentId)
        }.bind(this)
      )
    )
  }

  private async setRootPositions(): Promise<UpdateResult> {
    return getCustomRepository(LinkRepository)
      .createQueryBuilder()
      .update()
      .set({
        position: 0,
      })
      .where('type = :type', { type: 'root' })
      .execute()
  }

  private async setPositions(parentId: number) {
    const links = await getCustomRepository(LinkRepository)
      .createQueryBuilder('link')
      .where('link.parentId = :parentId', { parentId })
      .orderBy('link.position')
      .getMany()

    let position = 1

    return Promise.all(
      links.map(async (link: Link) => {
        link.position = position++
        return getCustomRepository(LinkRepository).save(link)
      })
    )
  }
}
