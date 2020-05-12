import { EntityRepository, Repository, getTreeRepository } from 'typeorm'
import { Link } from '../entities/Link'
import { Space } from '../entities/Space'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  async getTreeBySpaceId(spaceId: number): Promise<Link[]> {
    const roots = await this.getRootsBySpaceId(spaceId)
    await Promise.all(
      roots.map((root) => getTreeRepository(Link).findDescendantsTree(root))
    )

    return roots
  }

  async getRootsBySpaceId(spaceId: number): Promise<Link[]> {
    return this.createQueryBuilder('links')
      .innerJoin(Space, 'spaces', 'spaces.id = links.spaceId')
      .where('spaces.id = :spaceId', { spaceId })
      .andWhere('links.parent IS NULL')
      .getMany()
  }
}
