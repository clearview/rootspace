import { EntityRepository, Repository, getTreeRepository } from 'typeorm'
import { Link } from '../entities/Link'
import { Space } from '../entities/Space'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  async getRootsBySpaceId(spaceId: number): Promise<Link[]> {
    return this.createQueryBuilder('links')
      .innerJoin(Space, 'spaces', 'spaces.id = links.spaceId')
      .where('spaces.id = :spaceId', { spaceId })
      .andWhere('links.parent IS NULL')
      .orderBy({ 'links.created': 'ASC' })
      .getMany()
  }

  async getTreeBySpaceId(spaceId: number): Promise<Link[]> {
    const roots = await this.getRootsBySpaceId(spaceId)
    await Promise.all(
      roots.map((root) => getTreeRepository(Link).findDescendantsTree(root))
    )

    return this.sortTree(roots)
  }

  private sortTree(tree: Link[]): Link[] {
    const sorted = tree.sort((link1, link2) => {
      if (link1.created > link2.created) {
        return 1
      }

      if (link1.created < link2.created) {
        return -1
      }

      return 0
    })

    sorted.map((link) => {
      if (!link.children || link.children.length === 0) {
        return link
      }

      return (link.children = this.sortTree(link.children))
    })

    return sorted
  }
}
