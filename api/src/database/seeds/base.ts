import {Factory, Seeder} from 'typeorm-seeding'
import {User} from '../../entities/User'
import {Space} from '../../entities/Space'
import {Link, LinkType} from '../../entities/Link'
import {UserToSpace} from '../../entities/UserToSpace'
import {LinkService} from '../../services'

export class BaseSeeder implements Seeder {
  private static instance: BaseSeeder
  public linkService: LinkService
  public factory: Factory
  public user: User
  public space: Space
  public rootLink: Link

  constructor() {
    this.linkService = LinkService.getInstance()
    this.factory = null
    this.user = null
    this.space = null
    this.rootLink = null
  }

  public async run(factory: Factory): Promise<any> {
    this.factory = factory
    this.user = await this.createUser()
    this.space = await this.createSpace()
    this.rootLink = await this.createRootLink()

    return this
  }

  async createUser() {
    return this.factory(User)().create()
  }

  async createSpace() {
    const space = await this.factory(Space)().create({ userId: this.user.id })
    await this.factory(UserToSpace)().create({ userId: this.user.id, spaceId: space.id })

    return space
  }

  async createRootLink () {
    return this.factory(Link)().create({
      parent: null,
      userId: this.user.id,
      spaceId: this.space.id,
      title: 'root',
      type: LinkType.Root,
      value: String(this.space.id),
      position: 1
    })
  }
}