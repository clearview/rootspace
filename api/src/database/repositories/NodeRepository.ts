import { EntityRepository, Repository, UpdateResult } from 'typeorm'
import { Node } from '../entities/Node'
import { NodeType } from '../../shared/constants'
import { Favorite } from '../entities/Favorite'

@EntityRepository(Node)
export class NodeRepository extends Repository<Node> {
  getById(id: number, spaceId?: number, options: any = {}) {
    const query = this.createQueryBuilder('node').where('node.id = :id', { id })

    if (spaceId) {
      query.andWhere('node.spaceId = :spaceId', { spaceId })
    }

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
  }

  getByContentIdAndType(contentId: number, type: string, options: any = {}) {
    const query = this.createQueryBuilder('node').where('node.contentId = :contentId AND type = :type', {
      contentId,
      type,
    })

    if (options.withDeleted) {
      query.withDeleted()
    }

    return query.getOne()
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

  getBySpaceId(spaceId: number): Promise<Node[]> {
    return this.createQueryBuilder('node')
      .andWhere('node.spaceId = :spaceId', { spaceId })
      .andWhere('node.type != :rootType', { rootType: NodeType.Root })
      .getMany()
  }

  async getTreeBySpaceId(spaceId: number): Promise<Node[]> {
    const root = await this.getRootNodeBySpaceId(spaceId)
    let nodes = await this.getBySpaceId(spaceId)

    nodes = this.buildTree(nodes, root.id)
    nodes = this.sortTree(nodes)

    return nodes
  }

  getUserFavorites(userId: number, spaceId: number): Promise<Node[]> {
    return this.createQueryBuilder('node')
      .innerJoin(Favorite, 'favorite', 'node.id = favorite.nodeId')
      .where('favorite.userId = :userId', { userId })
      .andWhere('favorite.spaceId = :spaceId', { spaceId })
      .getMany()
  }

  async getArchiveBySpaceId(spaceId: number): Promise<Node[]> {
    const archiveNode = await this.getArchiveNodeBySpaceId(spaceId)

    const query = this.createQueryBuilder('node')
      .where('node.spaceId = :spaceId', { spaceId })
      .andWhere('node.deletedAt IS NOT NULL')
      .withDeleted()

    let nodes = await query.getMany()

    nodes = this.buildTree(nodes, archiveNode.id)
    nodes = this.sortTree(nodes)

    return nodes
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

  async getDescendantsTree(parentId: number): Promise<Node[]> {
    const parent = await this.getById(parentId, null, { withDeleted: true })
    let nodes = await this.getBySpaceId(parent.spaceId)

    nodes = this.buildTree(nodes, parent.id)
    nodes = this.sortTree(nodes)

    return nodes
  }

  async hasDescendant(ancestorId: number, descendantId: number): Promise<boolean> {
    const descendantsTree = await this.getDescendantsTree(ancestorId)
    const node = this.findInTree(descendantsTree, descendantId)

    return node ? true : false
  }

  async getNodeMaxPosition(parentId: number): Promise<number> {
    return this.createQueryBuilder('node')
      .where('node.parentId = :parentId', { parentId })
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

  private buildTree(nodes: Node[], rootId: number): Node[] {
    const tree = []

    for (const node of nodes) {
      if (node.parentId === rootId) {
        tree.push(node)
      }
    }

    for (const node of tree) {
      node.children = this.buildChildrenTree(node, nodes)
    }

    return tree
  }

  private buildChildrenTree(parent: Node, nodes: Node[]) {
    const children = []

    for (const node of nodes) {
      if (node.parentId === parent.id) {
        node.children = this.buildChildrenTree(node, nodes)
        children.push(node)
      }
    }

    return children
  }

  private sortTree(nodes: Node[]): Node[] {
    const sorted = nodes.sort((node1, node2) => {
      if (node1.position > node2.position) {
        return 1
      }

      if (node1.position < node2.position) {
        return -1
      }

      return 0
    })

    sorted.map((node) => {
      if (!node.children || node.children.length === 0) {
        return node
      }

      return (node.children = this.sortTree(node.children))
    })

    return sorted
  }

  private findInTree(nodes: Node[], findId: number): Node | null {
    for (const node of nodes) {
      if (node.id === findId) {
        return node
      }

      if (node.children && node.children.length > 0) {
        const result = this.findInTree(node.children, findId)

        if (result) {
          return result
        }
      }
    }

    return null
  }
}
