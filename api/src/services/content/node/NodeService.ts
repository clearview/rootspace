import { getCustomRepository, getTreeRepository } from 'typeorm'
import { NodeRepository } from '../../../database/repositories/NodeRepository'
import { Node } from '../../../database/entities/Node'
import { UserToSpace } from '../../../database/entities/UserToSpace'
import { ContentAccess } from '../../../database/entities/ContentAccess'
import { NodeCreateValue, NodeUpdateValue } from './values'
import { NodeContentType, NodeType } from '../../../shared/constants'
import { INodeContentUpdate } from '../NodeContentUpdate'
import { NodeContentMediator } from '../NodeContentMediator'
import { clientError, HttpErrName, HttpStatusCode } from '../../../response/errors'
import { Service } from '../../Service'
import { NodeActivity } from '../../activity/activities/space'
import { ContentAccessType, ContentPermissions } from '../../content-access'
import { buildTree } from './tree'

export class NodeService extends Service {
  private nodeContentMediator: NodeContentMediator

  private static instance: NodeService

  static getInstance() {
    if (!NodeService.instance) {
      NodeService.instance = new NodeService()
    }

    return NodeService.instance
  }

  setMediator(mediator: NodeContentMediator) {
    this.nodeContentMediator = mediator
  }

  getRepository(): NodeRepository {
    return getCustomRepository(NodeRepository)
  }

  getNodeById(id: number, spaceId: number = null, options: any = {}): Promise<Node | undefined> {
    return this.getRepository().getNodeById(id, spaceId, options)
  }

  async requireNodeById(id: number, spaceId: number = null, options: any = {}): Promise<Node> {
    const node = await this.getNodeById(id, spaceId, options)

    if (!node) {
      throw clientError('Node not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return node
  }

  getNodeByContent(contentId: number, type: string, options: any = {}): Promise<Node | undefined> {
    return this.getRepository().getNodeByContent(contentId, type, options)
  }

  getRootNodeBySpaceId(spaceId: number): Promise<Node> {
    return this.getRepository().getRootNodeBySpaceId(spaceId)
  }

  async requireArchiveNodeBySpaceId(spaceId: number): Promise<Node> {
    const node = await this.getRepository().getArchiveNodeBySpaceId(spaceId)

    if (node) {
      return node
    }

    return this.createSpaceArchiveNode(spaceId)
  }

  async requirePrivateNode(userId: number, spaceId: number) {
    let node = await this.getRepository().getPrivateNode(userId, spaceId)

    if (!node) {
      node = await this.create(
        NodeCreateValue.fromObject({
          userId,
          spaceId,
          contentId: userId,
          title: 'Private',
          type: NodeType.Private,
        })
      )

      await this.updateNodePosition(node, 0)
    }

    return node
  }

  async getSpaceTree(spaceId: number, spaceUser: UserToSpace): Promise<Node[]> {
    const root = await this.getRootNodeBySpaceId(spaceId)
    const nodes = await this.getRepository().getNodesBySpaceId(spaceId)

    for (const node of nodes) {
      const persmisions = new ContentPermissions(node.contentAccess, spaceUser)
      Object.assign(node, { persmisions: persmisions.getList() })
    }

    const tree = buildTree(nodes, root)
    return tree
  }

  async getSpaceArchiveTree(spaceId: number, spaceUser: UserToSpace): Promise<Node[]> {
    const archiveNode = await this.requireArchiveNodeBySpaceId(spaceId)
    const nodes = await this.getRepository().getArchivedBySpaceId(spaceId)

    for (const node of nodes) {
      const persmisions = new ContentPermissions(node.contentAccess, spaceUser)
      Object.assign(node, { persmisions: persmisions.getList() })
    }

    const tree = buildTree(nodes, archiveNode)
    return tree
  }

  async deleteArchivedBySpaceId(spaceId: number, spaceUser: UserToSpace): Promise<Node[]> {
    const tree = await this.getSpaceArchiveTree(spaceId, spaceUser)

    for (const node of tree) {
      // Just some additional check can't hurt
      if (node.deletedAt === null) {
        continue
      }

      await this.remove(node.id, spaceUser.userId)
    }

    return tree
  }

  getUserFavorites(userId: number, spaceId: number): Promise<Node[]> {
    return this.getRepository().getUserFavorites(userId, spaceId)
  }

  async createSpaceRootNode(spaceId: number, userId: number): Promise<Node> {
    const node = this.getRepository().create()

    node.userId = userId
    node.spaceId = spaceId
    node.contentId = spaceId
    node.title = 'Space'
    node.type = NodeType.Root
    node.position = 0

    return this.getRepository().save(node)
  }

  async createSpaceArchiveNode(spaceId: number): Promise<Node> {
    const rootNode = await this.getRootNodeBySpaceId(spaceId)
    const node = this.getRepository().create()

    node.userId = rootNode.userId
    node.spaceId = rootNode.spaceId
    node.contentId = rootNode.spaceId
    node.title = 'Archive'
    node.type = NodeType.Archive
    node.position = 0

    return this.getRepository().save(node)
  }

  async create(data: NodeCreateValue): Promise<Node> {
    const node = this.getRepository().create()

    const parent = data.parent
      ? await this.getNodeById(data.parent)
      : await this.getRootNodeBySpaceId(data.attributes.spaceId)

    if (!parent) {
      throw clientError('Cant not find parent node or space root node')
    }

    Object.assign(node, data.attributes)
    node.parent = parent

    const savedNode = await this.getRepository().save(node)

    await this.nodeContentMediator.nodeCreated(node, parent)
    await this.notifyActivity(NodeActivity.created(savedNode, savedNode.userId))

    return savedNode
  }

  async update(data: NodeUpdateValue, id: number, actorId: number): Promise<Node> {
    const node = await this.getNodeById(id)

    if (!node) {
      throw clientError('Error updating node')
    }

    const updatedNode = await this._update(data, node, actorId)
    this.nodeContentMediator.nodeUpdated(updatedNode, actorId)

    return updatedNode
  }

  async contentUpdated(contentId: number, type: string, actorId: number, data: INodeContentUpdate): Promise<void> {
    const node = await this.getNodeByContent(contentId, type)

    if (!node) {
      return
    }

    const value = NodeUpdateValue.fromObject({ title: data.title })
    await this._update(value, node, actorId)
  }

  async contentAccessUpdated(contentAccess: ContentAccess): Promise<void> {
    const node = await this.requireNodeById(contentAccess.nodeId)
    const parent = await this.requireNodeById(node.parentId)
    const descendents = await this.getRepository().getDescendants(node.id)

    if (contentAccess.type === ContentAccessType.Private && parent.type !== NodeType.Private) {
      const privateNode = await this.requirePrivateNode(contentAccess.ownerId, contentAccess.spaceId)
      await this._update(NodeUpdateValue.fromObject({}).withParent(privateNode.id), node, contentAccess.ownerId)
    }

    if (contentAccess.type !== ContentAccessType.Private && parent.type === NodeType.Private) {
      await this._update(NodeUpdateValue.fromObject({}).withParent(null), node, contentAccess.ownerId)
    }

    if (descendents.length > 0) {
      await this.nodeContentMediator.nodeAccessUpdated(node, descendents, contentAccess)
    }
  }

  private async _update(data: NodeUpdateValue, node: Node, actorId: number): Promise<Node> {
    let updatedNode = await this.getNodeById(node.id)

    Object.assign(updatedNode, data.attributes)
    updatedNode = await this.getRepository().save(updatedNode)

    if (data.parent !== undefined) {
      updatedNode = await this.updateNodeParent(updatedNode, data.parent)
    }

    if (data.position !== undefined) {
      updatedNode = await this.updateNodePosition(updatedNode, data.position)
    }

    await this.notifyActivity(NodeActivity.updated(node, updatedNode, actorId))

    return updatedNode
  }

  private async updateNodeParent(node: Node, toParentId: number | null): Promise<Node> {
    const fromParentId = node.parentId
    const fromPosition = node.position

    const toParent = toParentId
      ? await this.getNodeById(toParentId, node.spaceId)
      : await this.getRootNodeBySpaceId(node.spaceId)

    if (toParent === undefined) {
      throw clientError('Cant not find node ' + toParentId)
    }

    if (node.parentId === toParent.id) {
      return node
    }

    if (node.id === toParentId) {
      throw clientError('Cant move node into itself')
    }

    if (await this.getRepository().hasDescendant(node.id, toParent.id)) {
      throw clientError('Cant move node into his own descendant ' + toParent.id)
    }

    // const descendants = await this.getRepository().getDescendants(node.id)

    node.parent = toParent
    node.position = await this.getNodeNextPosition(toParent)
    node = await getTreeRepository(Node).save(node)

    await this.getRepository().decreasePositions(fromParentId, fromPosition)
    // await this.nodeContentMediator.nodeMoved(node, toParent, descendants)

    return node
  }

  private async updateNodePosition(node: Node, toPosition: number): Promise<Node> {
    if (toPosition === node.position) {
      return node
    }

    const parent = await this.requireNodeById(node.parentId)

    const minPosition = await this.getChildMinPosition(parent)
    const maxPosition = await this.getChildMaxPosition(parent)
    const fromPosition = node.position

    if (toPosition > maxPosition) {
      toPosition = maxPosition
    }

    if (toPosition < minPosition) {
      toPosition = minPosition
    }

    if (toPosition > fromPosition) {
      await this.getRepository().decreasePositions(parent.id, fromPosition, toPosition)
    }

    if (toPosition < fromPosition) {
      await this.getRepository().increasePositions(parent.id, toPosition, fromPosition)
    }

    node.position = toPosition
    return this.getRepository().save(node)
  }

  private async getNodeNextPosition(node: Node): Promise<number> {
    let position = await this.getChildMaxPosition(node)
    position++
    return position
  }

  private async getChildMaxPosition(node: Node): Promise<number> {
    return this.getRepository().countParentChildrens(node.id)
  }

  private async getChildMinPosition(node: Node): Promise<number> {
    if (node.type !== NodeType.Root) {
      return 1
    }

    const position = await this.getRepository().countPrivateNodes(node.id)
    return position + 1
  }

  async archive(id: number, actorId: number): Promise<Node> {
    let node = await this.requireNodeById(id, null, { withDeleted: true })

    node = await this._archive(node, actorId)
    await this.nodeContentMediator.nodeArchived(node, actorId)

    return node
  }

  async contentArchived(contentId: number, type: string, actorId: number): Promise<void> {
    const node = await this.getNodeByContent(contentId, type)

    if (!node) {
      return
    }

    await this._archive(node, actorId)
  }

  private async _archive(node: Node, actorId: number): Promise<Node> {
    const archiveNode = await this.requireArchiveNodeBySpaceId(node.spaceId)

    await this._archiveChildren(node, actorId)

    node.restoreParentId = node.parentId
    node = await this.getRepository().save(node)

    node = await this.updateNodeParent(node, archiveNode.id)
    node = await this.getRepository().softRemove(node)

    await this.notifyActivity(NodeActivity.archived(node, actorId))

    return node
  }

  private async _archiveChildren(node: Node, actorId: number): Promise<void> {
    const children = await this.getRepository().getChildren(node.id)

    if (children.length === 0) {
      return
    }

    for (let child of children) {
      await this._archiveChildren(child, actorId)

      child.restoreParentId = child.parentId
      child = await this.getRepository().save(child)

      child = await this.getRepository().softRemove(child)
      await this.nodeContentMediator.nodeArchived(child, actorId)
    }
  }

  async restore(id: number, actorId: number): Promise<Node> {
    let node = await this.requireNodeById(id, null, { withDeleted: true })
    node = await this._restore(node, actorId)

    await this.nodeContentMediator.nodeRestored(node, actorId)
    return node
  }

  async contentRestored(contentId: number, type: string, actorId: number): Promise<void> {
    const node = await this.getNodeByContent(contentId, type, {
      withDeleted: true,
    })

    if (!node) {
      return
    }

    await this._restore(node, actorId)
  }

  private async _restore(node: Node, actorId: number): Promise<Node> {
    const restoreToParent = await this._getRestoreParentNode(node)
    await this.updateNodeParent(node, restoreToParent.id)

    node.restoreParentId = null
    node = await this.getRepository().save(node)

    node = await this.getRepository().recover(node)
    await this._restoreChildren(node, actorId)

    await this.notifyActivity(NodeActivity.restored(node, actorId))

    return node
  }

  private async _restoreChildren(node: Node, actorId: number): Promise<void> {
    const children = await this.getRepository().getChildren(node.id, {
      withDeleted: true,
    })

    if (children.length === 0) {
      return
    }

    for (let child of children) {
      child.restoreParentId = null
      child = await this.getRepository().save(child)

      child = await this.getRepository().recover(child)
      await this.nodeContentMediator.nodeRestored(child, actorId)

      await this._restoreChildren(child, actorId)
    }
  }

  private async _getRestoreParentNode(node: Node): Promise<Node> {
    const parentNode = await this.getNodeById(node.restoreParentId)

    if (parentNode) {
      return parentNode
    }

    return this.getRootNodeBySpaceId(node.spaceId)
  }

  async remove(id: number, actorId: number) {
    let node = await this.requireNodeById(id, null, { withDeleted: true })

    node = await this._remove(node, actorId)
    await this.nodeContentMediator.nodeRemoved(node, actorId)

    return node
  }

  async contentRemoved(contentId: number, type: string, actorId: number): Promise<void> {
    const node = await this.getNodeByContent(contentId, type, {
      withDeleted: true,
    })

    if (node) {
      await this._remove(node, actorId)
    }
  }

  private async _remove(node: Node, actorId: number): Promise<Node> {
    await this._removeChildren(node, actorId)
    node = await this.getRepository().remove(node)

    await this.getRepository().decreasePositions(node.parentId, node.position)
    await this.notifyActivity(NodeActivity.deleted(node, actorId))

    return node
  }

  private async _removeChildren(node: Node, actorId: number): Promise<void> {
    const children = await this.getRepository().getChildren(node.id, {
      withDeleted: true,
    })

    if (children.length === 0) {
      return
    }

    for (const child of children) {
      await this._removeChildren(child, actorId)
      await this.getRepository().remove(child)
      await this.nodeContentMediator.nodeRemoved(child, actorId)
    }
  }

  verifyUpdate(node: Node): void {
    if (Object.values(NodeContentType).includes(node.type) === false) {
      throw clientError('Can not update node')
    }
  }

  verifyArchive(node: Node): void {
    if (Object.values(NodeContentType).includes(node.type) === false || node.deletedAt !== null) {
      throw clientError('Can not archive node')
    }
  }

  verifyRestore(node: Node) {
    if (Object.values(NodeContentType).includes(node.type) === false || node.deletedAt === null) {
      throw clientError('Can not restore node')
    }
  }

  verifyRemove(node: Node): void {
    if (Object.values(NodeContentType).includes(node.type) === false || node.deletedAt === null) {
      throw clientError('Can not delete node')
    }
  }
}
