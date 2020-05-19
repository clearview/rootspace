import {
  EntityRepository,
  Repository,
  getTreeRepository,
  UpdateResult,
} from 'typeorm'
import { Link } from '../entities/Link'
import { Space } from '../entities/Space'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  getRawById(id: number): Promise<any> {
    return this.createQueryBuilder('link')
      .where('id = :id', { id })
      .getRawOne()
  }

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

  async getMaxPositionByParentId(parent: number | null): Promise<number> {
    const query = this.createQueryBuilder('link').select(
      'Max(link.position)',
      'position'
    )

    if (parent) {
      query.where('link.parent = :parent', { parent })
    } else {
      query.where('link.parent IS NULL')
    }

    const { position } = await query.getRawOne()
    return position
  }

  async decreasePositions(
    parent: number | null,
    fromPosition: number,
    toPostion?: number
  ): Promise<UpdateResult> {
    const query = this.createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('position > :fromPosition', { fromPosition })

    if (toPostion) {
      query.andWhere('position <= :toPostion', { toPostion })
    }

    if (parent) {
      query.andWhere('parent = :parent', { parent })
    } else {
      query.andWhere('parent IS NULL')
    }

    return query.execute()
  }

  async increasePositions(
    parent: number | null,
    fromPosition: number,
    toPostion?: number
  ): Promise<UpdateResult> {
    const query = this.createQueryBuilder()
      .update()
      .set({ position: () => 'position + 1' })
      .where('position >= :fromPosition', { fromPosition })

    if (toPostion) {
      query.andWhere('position < :toPostion', { toPostion })
    }

    if (parent) {
      query.andWhere('parent = :parent', { parent })
    } else {
      query.andWhere('parent IS NULL')
    }

    return query.execute()
  }

  private sortTree(tree: Link[]): Link[] {
    const sorted = tree.sort((link1, link2) => {
      if (link1.position > link2.position) {
        return 1
      }

      if (link1.position < link2.position) {
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
