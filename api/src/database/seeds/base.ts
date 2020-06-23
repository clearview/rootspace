import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'
import { UserToSpace } from '../../entities/UserToSpace'
import { Node } from '../../entities/Node'
import { NodeType } from '../../types/node'

export class BaseSeeder implements Seeder {
  public factory: Factory
  public user: User
  public space: Space
  public spaceRootNode: Node

  private static instance: BaseSeeder

  public async run(factory: Factory, connection: Connection): Promise<any> {
    if (BaseSeeder.instance) {
      return BaseSeeder.instance
    }

    this.factory = factory

    this.user = await this.createUser()
    this.space = await this.createSpace()
    this.spaceRootNode = await this.createSpaceRootNode()

    return (BaseSeeder.instance = this)
  }

  async createUser() {
    return this.factory(User)().create()
  }

  async createSpace() {
    const space = await this.factory(Space)().create({ userId: this.user.id })
    await this.factory(UserToSpace)().create({
      userId: this.user.id,
      spaceId: space.id,
    })

    return space
  }

  async createSpaceRootNode() {
    return this.factory(Node)().create({
      parent: null,
      userId: this.user.id,
      spaceId: this.space.id,
      contentId: this.space.id,
      title: 'root',
      type: NodeType.Root,
    })
  }
}
