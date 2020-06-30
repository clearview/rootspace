import { Factory } from 'typeorm-seeding'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'
import { UserToSpace } from '../../entities/UserToSpace'
import { Node } from '../../entities/Node'
import { NodeType } from '../../types/node'

export class SeederBase {
  public factory: Factory
  public user: User
  public space: Space
  public rootNode: Node

  private static instance: SeederBase

  private constructor(factory: Factory) {
    this.factory = factory
  }

  static async getInstance(
    factory: Factory,
    initNew: boolean = false
  ): Promise<SeederBase> {
    if (SeederBase.instance && initNew !== true) {
      return SeederBase.instance
    }

    const i = new SeederBase(factory)
    await i.init()

    return (this.instance = i)
  }

  private async init() {
    this.user = await this.createUser()
    this.space = await this.createSpace()
    this.rootNode = await this.createRootNode()
  }

  private async createUser() {
    return this.factory(User)().create()
  }

  private async createSpace() {
    const space = await this.factory(Space)().create({ userId: this.user.id })

    await this.factory(UserToSpace)().create({
      userId: this.user.id,
      spaceId: space.id,
    })

    return space
  }

  private async createRootNode() {
    return this.factory(Node)().create({
      userId: this.user.id,
      spaceId: this.space.id,
      contentId: this.space.id,
      title: 'root',
      type: NodeType.Root,
      position: 0,
    })
  }
}
