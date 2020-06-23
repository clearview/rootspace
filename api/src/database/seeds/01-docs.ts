import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { Link, LinkType } from '../../entities/Link'
import { Doc } from '../../entities/Doc'
import { UserSpace } from '../base/userSpace'

export default class DocsSeeder implements Seeder {
    protected base: UserSpace

    public async run(factory: Factory, connection: Connection): Promise<any> {
        this.base = await UserSpace.getInstance(factory)

  async seedDocuments(count: number, parentNode: Node, treeDepth: number) {
    const nodes = await this.createDocuments(count, parentNode)

    if (treeDepth > 0) {
      for (const node of nodes) {
        await this.seedDocuments(count, node, treeDepth - 1)
      }
    }
  }

  async createDocuments(count: number, parentNode: Node) {
    const docs = await this.base
      .factory(Doc)()
      .map(async (doc: Doc) => {
        doc.userId = this.base.user.id
        doc.spaceId = this.base.space.id
        return doc
      })
      .createMany(count)

    const nodes = []

    for (const doc of docs) {
      nodes.push(
        await this.base
          .factory(Node)()
          .create({
            userId: this.base.user.id,
            spaceId: this.base.space.id,
            contentId: doc.id,
            title: doc.title,
            type: NodeType.Document,
            parent: parentNode,
          })
      )
    }

    return nodes
  }
}
