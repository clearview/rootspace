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
    return this.createQueryBuilder('link')
      .innerJoin(Space, 'space', 'Space.id = link.spaceId')
      .where('space.id = :spaceId', { spaceId })
      .andWhere('link.parent IS NULL')
      .getMany()
  }
}
