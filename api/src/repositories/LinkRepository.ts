import {
  EntityRepository,
  Repository,
  UpdateResult,
  getTreeRepository,
} from 'typeorm'
import { Link } from '../entities/Link'
import { LinkType } from '../constants'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  getById(id: number, spaceId?: number) {
    const query = this.createQueryBuilder('link').where('link.id = :id', { id })

    if (spaceId) {
      query.andWhere('link.spaceId = :spaceId', { spaceId })
    }

    return query.getOne()
  }

  async getBySpaceId(spaceId: number): Promise<Link[]> {
    const root = await this.getRootBySpaceId(spaceId)

    let links = await this.createQueryBuilder('link')
      .where('link.spaceId = :spaceId', { spaceId })
      .andWhere('link.id != :id', { id: root.id })
      .getMany()

    links = this.buildTree(links, root.id)
    links = this.sortTree(links)

    return links
  }

  getRootBySpaceId(spaceId: number): Promise<Link> {
    return this.createQueryBuilder('link')
      .where('link.type = :type AND value = :value', {
        type: LinkType.Root,
        value: spaceId,
      })
      .getOne()
  }

  getChildren(parentId: number): Promise<Link[]> {
    return this.createQueryBuilder('link')
      .where('link.parentId = :parentId', {
        parentId,
      })
      .orderBy('position', 'ASC')
      .getMany()
  }

  async hasDescendant(ancestor: Link, descendantId: number): Promise<boolean> {
    const count = await getTreeRepository(Link)
      .createDescendantsQueryBuilder('link', null, ancestor)
      .andWhere('link.id = :descendantId', { descendantId })
      .andWhere('link.spaceId = :spaceId', { spaceId: ancestor.spaceId })
      .getCount()

    if (count) {
      return true
    }

    return false
  }

  async getNodeMaxPosition(parentId: number): Promise<number> {
    return this.createQueryBuilder('link')
      .where('link.parentId = :parentId', { parentId })
      .getCount()
  }

  async decreasePositions(
    parentId: number,
    fromPosition: number,
    toPostion?: number
  ): Promise<UpdateResult> {
    const query = this.createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('parentId = :parentId', { parentId })
      .andWhere('position > :fromPosition', { fromPosition })

    if (toPostion) {
      query.andWhere('position <= :toPostion', { toPostion })
    }

    return query.execute()
  }

  async increasePositions(
    parentId: number,
    fromPosition: number,
    toPostion?: number
  ): Promise<UpdateResult> {
    const query = this.createQueryBuilder()
      .update()
      .set({ position: () => 'position + 1' })
      .where('parentId = :parentId', { parentId })
      .andWhere('position >= :fromPosition', { fromPosition })

    if (toPostion) {
      query.andWhere('position < :toPostion', { toPostion })
    }

    return query.execute()
  }

  private buildTree(links: Link[], rootId: number): Link[] {
    const tree = []

    for (const link of links) {
      if (link.parentId === rootId) {
        tree.push(link)
      }
    }

    for (const link of tree) {
      link.children = this.buildChildrenTree(link, links)
    }

    return tree
  }

  private buildChildrenTree(parent: Link, links: Link[]) {
    const children = []

    for (const link of links) {
      if (link.parentId === parent.id) {
        link.children = this.buildChildrenTree(link, links)
        children.push(link)
      }
    }

    return children
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
