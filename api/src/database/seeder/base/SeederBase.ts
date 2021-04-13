import { Factory } from 'typeorm-seeding'
import { User } from '../../entities/User'
import { Space } from '../../entities/Space'
import { UserToSpace } from '../../entities/UserToSpace'
import { Node } from '../../entities/Node'
import { NodeType } from '../../../root/constants'

export class SeederBase {
  public factory: Factory
  public user: User
  public space: Space
  public rootNode: Node

  private static instance: SeederBase

  private constructor(factory: Factory) {
    this.factory = factory
  }

  static async shared(factory: Factory): Promise<SeederBase> {
    if (SeederBase.instance) {
      return SeederBase.instance
    }

    return (SeederBase.instance = await SeederBase.create(factory))
  }

  static create(factory: Factory) {
    return new SeederBase(factory).init()
  }

  private async init() {
    this.user = await this.createUser()
    this.space = await this.createSpace()
    this.rootNode = await this.createRootNode()
    return this
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
