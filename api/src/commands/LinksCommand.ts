import chalk from 'chalk'
import db from '../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../repositories/SpaceRepository'
import { LinkRepository } from '../repositories/LinkRepository'
import { Link } from '../entities/Link'
import { Space } from '../entities/Space'

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

    const spaces = await getCustomRepository(SpaceRepository)
      .createQueryBuilder('space')
      .getMany()

    await Promise.all(
      spaces.map(
        async function(space: Space) {
          const links = await getCustomRepository(LinkRepository).getBySpaceId(
            space.id
          )
          return this.updatePositions(links)
        }.bind(this)
      )
    )
  }

  private async updatePositions(links: Link[]) {
    let position = 1

    await Promise.all(
      links.map(
        async function(link: Link) {
          if (link.children && link.children.length > 0) {
            await this.updatePositions(link.children)
          }

          link.position = position++
          return getCustomRepository(LinkRepository).save(link)
        }.bind(this)
      )
    )
  }
}
