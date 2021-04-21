import { getCustomRepository, getTreeRepository } from 'typeorm'
import { NodeRepository } from '../../../database/repositories/NodeRepository'
import { Node } from '../../../database/entities/Node'
import { NodeCreateValue, NodeUpdateValue } from './values'
import { NodeType } from '../../../root/constants'
import { INodeContentUpdate } from '../NodeContentUpdate'
import { NodeContentMediator } from '../NodeContentMediator'
import { clientError, HttpErrName, HttpStatusCode } from '../../../response/errors'
import { Service } from '../../Service'
import { NodeActivity } from '../../activity/activities/space'

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

  getNodeRepository(): NodeRepository {
    return getCustomRepository(NodeRepository)
  }

  getNodeById(id: number, spaceId: number = null, options: any = {}): Promise<Node | undefined> {
    return this.getNodeRepository().getById(id, spaceId, options)
  }

  async requireNodeById(id: number, spaceId: number = null, options: any = {}): Promise<Node> {
    const node = await this.getNodeById(id, spaceId, options)

    if (!node) {
      throw clientError('Node not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return node
  }

  getNodeByContentId(contentId: number, type: string, options: any = {}): Promise<Node | undefined> {
    return this.getNodeRepository().getByContentIdAndType(contentId, type, options)
  }

  getRootNodeBySpaceId(spaceId: number): Promise<Node> {
    return this.getNodeRepository().getRootNodeBySpaceId(spaceId)
  }

  async getArchiveNodeBySpaceId(spaceId: number): Promise<Node> {
    const node = await this.getNodeRepository().getArchiveNodeBySpaceId(spaceId)

    if (node) {
      return node
    }

    return this.createSpaceArchiveNode(spaceId)
  }

  getTreeBySpaceId(spaceId: number): Promise<Node[]> {
    return this.getNodeRepository().getTreeBySpaceId(spaceId)
  }

  getArchiveTreeBySpaceId(spaceId: number): Promise<Node[]> {
    return this.getNodeRepository().getArchiveBySpaceId(spaceId)
  }

  async deleteArchivedBySpaceId(spaceId: number, actorId: number): Promise<Node[]> {
    const tree = await this.getArchiveTreeBySpaceId(spaceId)

    for (const node of tree) {
      // Just some additional check can't hurt
      if (node.deletedAt === null) {
        continue
      }

      await this.remove(node.id, actorId)
    }

    return tree
  }

  getUserFavorites(userId: number, spaceId: number): Promise<Node[]> {
    return this.getNodeRepository().getUserFavorites(userId, spaceId)
  }

  getNodeMaxPosition(parentId: number): Promise<number> {
    return this.getNodeRepository().getNodeMaxPosition(parentId)
  }

  async getNodeNextPosition(parentId: number): Promise<number> {
    let position = await this.getNodeMaxPosition(parentId)
    return ++position
  }

  async createSpaceRootNode(spaceId: number, userId: number): Promise<Node> {
    const node = this.getNodeRepository().create()

    node.userId = userId
    node.spaceId = spaceId
    node.contentId = spaceId
    node.title = 'Space'
    node.type = NodeType.Root
    node.position = 0

    return this.getNodeRepository().save(node)
  }

  async createSpaceArchiveNode(spaceId: number): Promise<Node> {
    const rootNode = await this.getRootNodeBySpaceId(spaceId)
    const node = this.getNodeRepository().create()

    node.userId = rootNode.userId
    node.spaceId = rootNode.spaceId
    node.contentId = rootNode.spaceId
    node.title = 'Archive'
    node.type = NodeType.Archive
    node.position = 0

    return this.getNodeRepository().save(node)
  }

  async create(data: NodeCreateValue): Promise<Node> {
    const node = this.getNodeRepository().create()

    const parent = data.parent
      ? await this.getNodeById(data.parent)
      : await this.getRootNodeBySpaceId(data.attributes.spaceId)

    if (!parent) {
      throw clientError('Cant not find parent node or space root node')
    }

    Object.assign(node, data.attributes)
    node.parent = parent

    const savedNode = await this.getNodeRepository().save(node)
    this.notifyActivity(NodeActivity.created(savedNode, savedNode.userId))

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
    const node = await this.getNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    const value = NodeUpdateValue.fromObject({ title: data.title })
    await this._update(value, node, actorId)
  }

  private async _update(data: NodeUpdateValue, node: Node, actorId: number): Promise<Node> {
    let updatedNode = await this.getNodeById(node.id)

    Object.assign(updatedNode, data.attributes)
    await this.getNodeRepository().save(updatedNode)

    if (data.parent !== undefined) {
      updatedNode = await this.updateNodeParent(updatedNode, data.parent)
    }

    if (data.position !== undefined) {
      updatedNode = await this.updateNodePosition(updatedNode, data.position)
    }

    await this.notifyActivity(NodeActivity.updated(node, updatedNode, actorId))

    return updatedNode
  }

  async updateNodeParent(node: Node, toParentId: number | null): Promise<Node> {
    const fromParentId = node.parentId
    const fromPosition = node.position

    if (toParentId === fromParentId) {
      return node
    }

    const parent = toParentId
      ? await this.getNodeById(toParentId, node.spaceId)
      : await this.getRootNodeBySpaceId(node.spaceId)

    if (parent === undefined) {
      throw clientError('Cant not find node ' + toParentId)
    }

    if (node.id === toParentId) {
      throw clientError('Cant move node into itself')
    }

    if (await this.getNodeRepository().hasDescendant(node.id, parent.id)) {
      throw clientError('Cant move node into his own descendant ' + parent.id)
    }

    node.parent = parent
    node.position = await this.getNodeNextPosition(parent.id)
    node = await getTreeRepository(Node).save(node)

    await this.getNodeRepository().decreasePositions(fromParentId, fromPosition)

    return node
  }

  async updateNodePosition(node: Node, toPosition: number): Promise<Node> {
    const parentId = node.parentId
    const fromPosition = node.position

    if (toPosition === node.position) {
      return node
    }

    const maxPosition = await this.getNodeMaxPosition(parentId)

    if (toPosition > maxPosition) {
      toPosition = maxPosition
    }

    if (toPosition > fromPosition) {
      await this.getNodeRepository().decreasePositions(parentId, fromPosition, toPosition)
    }

    if (toPosition < fromPosition) {
      await this.getNodeRepository().increasePositions(parentId, toPosition, fromPosition)
    }

    node.position = toPosition

    return this.getNodeRepository().save(node)
  }

  async archive(id: number, actorId: number): Promise<Node> {
    let node = await this.requireNodeById(id, null, { withDeleted: true })

    node = await this._archive(node, actorId)
    await this.nodeContentMediator.nodeArchived(node, actorId)

    return node
  }

  async contentArchived(contentId: number, type: string, actorId: number): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    await this._archive(node, actorId)
  }

  private async _archive(node: Node, actorId: number): Promise<Node> {
    this.verifyArchive(node)

    const archiveNode = await this.getArchiveNodeBySpaceId(node.spaceId)

    await this._archiveChildren(node, actorId)

    node.restoreParentId = node.parentId
    node = await this.getNodeRepository().save(node)

    node = await this.updateNodeParent(node, archiveNode.id)
    node = await this.getNodeRepository().softRemove(node)

    await this.notifyActivity(NodeActivity.archived(node, actorId))

    return node
  }

  private async _archiveChildren(node: Node, actorId: number): Promise<void> {
    const children = await this.getNodeRepository().getChildren(node.id)

    if (children.length === 0) {
      return
    }

    for (let child of children) {
      await this._archiveChildren(child, actorId)

      child.restoreParentId = child.parentId
      child = await this.getNodeRepository().save(child)

      child = await this.getNodeRepository().softRemove(child)
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
    const node = await this.getNodeByContentId(contentId, type, {
      withDeleted: true,
    })

    if (!node) {
      return
    }

    await this._restore(node, actorId)
  }

  private async _restore(node: Node, actorId: number): Promise<Node> {
    this.verifyRestore(node)

    const restoreToParent = await this._getRestoreParentNode(node)
    await this.updateNodeParent(node, restoreToParent.id)

    node.restoreParentId = null
    node = await this.getNodeRepository().save(node)

    node = await this.getNodeRepository().recover(node)
    await this._restoreChildren(node, actorId)

    await this.notifyActivity(NodeActivity.restored(node, actorId))

    return node
  }

  private async _restoreChildren(node: Node, actorId: number): Promise<void> {
    const children = await this.getNodeRepository().getChildren(node.id, {
      withDeleted: true,
    })

    if (children.length === 0) {
      return
    }

    for (let child of children) {
      child.restoreParentId = null
      child = await this.getNodeRepository().save(child)

      child = await this.getNodeRepository().recover(child)
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
    const node = await this.getNodeByContentId(contentId, type, {
      withDeleted: true,
    })

    if (node) {
      await this._remove(node, actorId)
    }
  }

  private async _remove(node: Node, actorId: number): Promise<Node> {
    this.verifyRemove(node)

    await this._removeChildren(node, actorId)
    node = await this.getNodeRepository().remove(node)

    await this.getNodeRepository().decreasePositions(node.parentId, node.position)

    await this.notifyActivity(NodeActivity.deleted(node, actorId))

    return node
  }

  private async _removeChildren(node: Node, actorId: number): Promise<void> {
    const children = await this.getNodeRepository().getChildren(node.id, {
      withDeleted: true,
    })

    if (children.length === 0) {
      return
    }

    for (const child of children) {
      await this._removeChildren(child, actorId)

      await this.getNodeRepository().remove(child)
      await this.nodeContentMediator.nodeRemoved(child, actorId)
    }
  }

  private verifyArchive(node: Node): void {
    if (node.type === NodeType.Root || node.type === NodeType.Archive || node.deletedAt !== null) {
      throw clientError('Can not archive node', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(node: Node) {
    if (node.type === NodeType.Root || node.type === NodeType.Archive || node.deletedAt === null) {
      throw clientError('Can not restore node', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(node: Node): void {
    if (node.type === NodeType.Root || node.type === NodeType.Archive) {
      throw clientError('Can not delete node', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }
}