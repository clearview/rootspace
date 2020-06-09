import { Connection } from 'typeorm'
import { Seeder, Factory } from 'typeorm-seeding'
import { Space } from '../../entities/Space'
import { User } from '../../entities/User'
import { Link } from '../../entities/Link'
import { Doc } from '../../entities/Doc'
import { UserToSpace } from '../../entities/UserToSpace'
import { LinkService } from '../../services/LinkService'

export default class MainSeeder implements Seeder {
  protected linkSrvice: LinkService

  constructor() {
    this.linkSrvice = LinkService.getInstance()
  }

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const user = await factory(User)().create()
    const spaces = await factory(Space)().createMany(1, { userId: user.id })

    for (const space of spaces) {
      await factory(UserToSpace)().create({ userId: user.id, spaceId: space.id })
      const linkRoot = await this.rootLink(factory, user, space)
      const links = await this.createLinkDocPair(factory, user, space, linkRoot, 3)
      for (const link of links) {
        const links01 = await this.createLinkDocPair(factory, user, space, link, 2)
        for (const link01 of links01) {
          const links02 = await this.createLinkDocPair(factory, user, space, link01, 3)
        }
      }
    }
  }

  async createLinkDocPair(factory: Factory, user, space, parentLink = null, count = 3) {
    const docs = await factory(Doc)().createMany(count)
    const links = []
    for (const doc of docs) {
      const linkPair = await factory(Link)().create({
        parent: parentLink || null,
        userId: user.id,
        spaceId: space.id,
        value: String(doc.id),
        position: await this.linkSrvice.getNodeNextPosition(parentLink.id)
      })
      links.push(linkPair)
    }
    return links
  }

  async rootLink (factory, user, space) {
    return factory(Link)().create({
      parent: null,
      userId: user.id,
      spaceId: space.id,
      title: 'root',
      type: 'root',
      value: space.id,
      position: 1
    })
  }
}