import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { SeederBase } from '../base/SeederBase'
import { Link } from '../../entities/Link'
import { Node } from '../../entities/Node'
import { NodeType } from '../../../root/constants'

export default class LinksSeeder implements Seeder {
  protected base: SeederBase

  public async run(factory: Factory, connection: Connection): Promise<any> {
    this.base = await SeederBase.shared(factory)
    await this.seedLinks(3, this.base.rootNode, 2)
  }

  async seedLinks(count: number, parentNode: Node, treeDepth: number) {
    const nodes = await this.createLinks(count, parentNode)

    if (treeDepth > 0) {
      for (const node of nodes) {
        await this.seedLinks(count, node, treeDepth - 1)
      }
    }
  }

  async createLinks(count: number, parentNode: Node): Promise<Node[]> {
    const links = await this.base
      .factory(Link)()
      .map(async (link: Link) => {
        link.userId = this.base.user.id
        link.spaceId = this.base.space.id
        return link
      })
      .createMany(count)

    const nodes = []

    for (const link of links) {
      nodes.push(
        await this.base
          .factory(Node)()
          .create({
            userId: this.base.user.id,
            spaceId: this.base.space.id,
            contentId: link.id,
            title: link.title,
            type: NodeType.Link,
            parent: parentNode,
          })
      )
    }

    return nodes
  }
}
