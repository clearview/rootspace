import { Connection } from 'typeorm'
import { Seeder, Factory } from 'typeorm-seeding'
import { Space } from '../../entities/Space'
import { User } from '../../entities/User'
import { Link } from '../../entities/Link'

export default class MainSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const user = await factory(User)().create()
    const spaces = await factory(Space)().createMany(3, { userId: user.id })

    for (const space of spaces) {
      const link = await factory(Link)().create({ userId: user.id, spaceId: space.id })
      const linksLevel01 = await factory(Link)().createMany(5, { parent: link, userId: user.id, spaceId: space.id })
      for (const linkLevel01 of linksLevel01) {
        const linksLevel02 = await factory(Link)().createMany(10, { parent: linkLevel01, userId: user.id, spaceId: space.id })
        for (const linkLevel02 of linksLevel02) {
          await factory(Link)().createMany(5, { parent: linkLevel02, userId: user.id, spaceId: space.id })
        }
      }
    }
  }
}