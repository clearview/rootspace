import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { Link, LinkType } from '../../entities/Link'
import { Doc } from '../../entities/Doc'
import { BaseSeeder } from './base'

export default class DocsSeeder implements Seeder {
    protected base: BaseSeeder

    public async run(factory: Factory, connection: Connection): Promise<any> {
        this.base = await new BaseSeeder().run(factory)

        await this.createDocuments()
    }

    async createDocuments() {
        const links = await this.createLinkDocPair(this.base.rootLink, 3)
        for (const link of links) {
            const links01 = await this.createLinkDocPair(link, 2)
            for (const link01 of links01) {
                await this.createLinkDocPair(link01, 3)
            }
        }
    }

    async createLinkDocPair(parentLink: Link, count = 3) {
        const docs = await this.base.factory(Doc)()
            .map(async (doc: Doc) => {
                doc.userId = this.base.user.id
                doc.spaceId = this.base.space.id
                return doc
            })
            .createMany(count)

        const links = []
        for (const doc of docs) {
            const linkPair = await this.base.factory(Link)().create({
                parent: parentLink,
                userId: this.base.user.id,
                spaceId: this.base.space.id,
                type: LinkType.Document,
                title: doc.title,
                value: String(doc.id),
                position: await this.base.linkService.getNodeNextPosition(parentLink.id)
            })
            links.push(linkPair)
        }

        return links
    }
}