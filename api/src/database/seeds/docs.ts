import { Connection } from 'typeorm'
import { Seeder, Factory } from 'typeorm-seeding'
import { Link } from '../../entities/Link'
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
        const docs = await this.base.factory(Doc)().createMany(count)
        const links = []
        for (const doc of docs) {
            const linkPair = await this.base.factory(Link)().create({
                parent: parentLink,
                userId: this.base.user.id,
                spaceId: this.base.space.id,
                value: String(doc.id),
                position: await this.base.linkService.getLinkNextPositionByParentId(parentLink.id)
            })
            links.push(linkPair)
        }

        return links
    }
}