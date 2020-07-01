import { Factory } from 'typeorm-seeding'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'
import { Link, LinkType } from '../../entities/Link'
import { UserToSpace } from '../../entities/UserToSpace'
import { LinkService } from '../../services'

export class UserSpace {
  private static instance: UserSpace

  public linkService: LinkService
  public factory: Factory
  public user: User
  public space: Space
  public rootLink: Link

  private constructor(factory: Factory) {
    this.linkService = LinkService.getInstance()
    this.factory = factory
    this.user = null
    this.space = null
    this.rootLink = null
  }

  static async getInstance(factory: Factory, withNewUserSpace?: boolean): Promise<UserSpace> {
    if (!UserSpace.instance) {
      UserSpace.instance = new UserSpace(factory)
      await UserSpace.populateuserSpace()
    }

    if (withNewUserSpace) {
      await UserSpace.populateuserSpace()
    }

    return UserSpace.instance
  }

  private static async populateuserSpace() {
    UserSpace.instance.user = await UserSpace.instance.createUser()
    UserSpace.instance.space = await UserSpace.instance.createSpace()
    UserSpace.instance.rootLink = await UserSpace.instance.createRootLink()
  }

  private async createUser() {
    return this.factory(User)().create()
  }

  private  async createSpace() {
    const space = await this.factory(Space)().create({ userId: this.user.id })
    await this.factory(UserToSpace)().create({ userId: this.user.id, spaceId: space.id })

    return space
  }

  private  async createRootLink () {
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