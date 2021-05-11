import { EntityRepository, Repository, UpdateResult } from 'typeorm'
import { Node } from '../entities/Node'
import { Favorite } from '../entities/Favorite'
import { NodeType } from '../../shared/constants'

@EntityRepository(Node)
export class NodeRepository extends Repository<Node> {
  getNodeById(id: number, spaceId?: number, options: any = {}) {
    const query = this.createQueryBuilder('node').where('node.id = :id', { id })

    if (spaceId) {
      query.andWhere('node.spaceId = :spaceId', { spaceId })
    }

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }

  getNodeByContent(contentId: number, type: string, options: any = {}) {
    const query = this.createQueryBuilder('node').where('node.contentId = :contentId AND type = :type', {
      contentId,
      type,
    })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }

  getNodesBySpaceId(spaceId: number): Promise<Node[]> {
    const query = this.createQueryBuilder('node')
      .leftJoinAndSelect('node.contentAccess', 'contentAccess')
      .where('node.spaceId = :spaceId', { spaceId })
      .andWhere('node.type != :typeRoot', { typeRoot: NodeType.Root })
      .andWhere('node.type != :typeArchive', { typeArchive: NodeType.Archive })

    return query.getMany()
  }

  getRootNodeBySpaceId(spaceId: number): Promise<Node> {
    return this.createQueryBuilder('node')
      .where('node.type = :type AND node.contentId = :contentId', {
        type: NodeType.Root,
        contentId: spaceId,
      })
      .getOne()
  }

  getArchiveNodeBySpaceId(spaceId: number): Promise<Node> {
    return this.createQueryBuilder('node')
      .where('node.type = :type AND node.contentId = :contentId', {
        type: NodeType.Archive,
        contentId: spaceId,
      })
      .getOne()
  }

  getArchivedBySpaceId(spaceId: number): Promise<Node[]> {
    return this.createQueryBuilder('node')
      .leftJoinAndSelect('node.contentAccess', 'contentAccess')
      .where('node.spaceId = :spaceId', { spaceId })
      .andWhere('node.deletedAt IS NOT NULL')
      .withDeleted()
      .getMany()
  }

  getPrivateNode(userId: number, spaceId: number): Promise<Node> {
    return this.createQueryBuilder('node')
      .where('node.type = :type AND node.userId = :userId AND node.spaceId = :spaceId', {
        type: NodeType.Private,
        userId,
        spaceId,
      })
      .getOne()
  }

  getUserFavorites(userId: number, spaceId: number): Promise<Node[]> {
    return this.createQueryBuilder('node')
      .innerJoin(Favorite, 'favorite', 'node.id = favorite.nodeId')
      .where('favorite.userId = :userId', { userId })
      .andWhere('favorite.spaceId = :spaceId', { spaceId })
      .getMany()
  }

  getChildren(parentId: number, options: any = {}): Promise<Node[]> {
    const query = this.createQueryBuilder('node')
      .where('node.parentId = :parentId', {
        parentId,
      })
      .orderBy('position', 'ASC')

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getMany()
  }

  async getDescendants(parentId: number): Promise<Node[]> {
    const parent = await this.getNodeById(parentId, null, { withDeleted: true })
    const nodes = await this.getNodesBySpaceId(parent.spaceId)

    return this.filterDescendants(parent, nodes)
  }

  async hasDescendant(ancestorId: number, descendantId: number): Promise<boolean> {
    const descendants = await this.getDescendants(ancestorId)
    const filtered = descendants.filter((descendant) => descendant.id === descendantId)

    return filtered.length > 0 ? true : false
  }

  async countParentChildrens(parentId: number): Promise<number> {
    return this.createQueryBuilder('node')
      .where('node.parentId = :parentId', { parentId })
      .getCount()
  }

  async countPrivateNodes(rootNodeId: number): Promise<number> {
    return this.createQueryBuilder('node')
      .where('node.parentId = :parentId', { parentId: rootNodeId })
      .andWhere('node.type = :type', { type: NodeType.Private })
      .getCount()
  }

  async decreasePositions(parentId: number, fromPosition: number, toPostion?: number): Promise<UpdateResult> {
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

  async increasePositions(parentId: number, fromPosition: number, toPostion?: number): Promise<UpdateResult> {
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

  private filterDescendants(parent: Node, nodes: Node[]) {
    const descendants = []

    for (const node of nodes) {
      if (parent.id === node.parentId) {
        descendants.push(node)
        descendants.push(...this.filterDescendants(node, nodes))
      }
    }

    return descendants
  }
}
