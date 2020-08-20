import httpRequestContext from 'http-request-context'
import { getCustomRepository, getTreeRepository } from 'typeorm'
import { NodeRepository } from '../../database/repositories/NodeRepository'
import { Node } from '../../database/entities/Node'
import { NodeCreateValue, NodeUpdateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { IContentNodeUpdate, INodeContentMediator } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { ActivityService } from '../ActivityService'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { NodeActivities } from '../../database/entities/activities/NodeActivities'
import { ServiceFactory } from '../factory/ServiceFactory'

export class NodeService {
  private mediator: INodeContentMediator
  private activityService: ActivityService

  private static instance: NodeService

  private constructor() {
    this.activityService = ServiceFactory.getInstance().getActivityService()
  }

  static getInstance() {
    if (!NodeService.instance) {
      NodeService.instance = new NodeService()
    }

    return NodeService.instance
  }

  setMediator(mediator: INodeContentMediator) {
    this.mediator = mediator
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

  getNodeByContentId(contentId: number, type: NodeType, options: any = {}): Promise<Node | undefined> {
    return this.getNodeRepository().getByContentIdAndType(contentId, type, options)
  }

  getRootNodeBySpaceId(spaceId: number): Promise<Node> {
    return this.getNodeRepository().getRootBySpaceId(spaceId)
  }

  async getArchiveNodeBySpaceId(spaceId: number): Promise<Node> {
    const node = await this.getNodeRepository().getArchiveNodeBySpaceId(spaceId)

    if (node) {
      return node
    }

    return this.createArchiveNodeBySpaceId(spaceId)
  }

  getTreeBySpaceId(spaceId: number): Promise<Node[]> {
    return this.getNodeRepository().getTreeBySpaceId(spaceId)
  }

  getArchiveBySpaceId(spaceId: number): Promise<Node[]> {
    return this.getNodeRepository().getArchiveBySpaceId(spaceId)
  }

  getNodeMaxPosition(parentId: number): Promise<number> {
    return this.getNodeRepository().getNodeMaxPosition(parentId)
  }

  async getNodeNextPosition(parentId: number): Promise<number> {
    let position = await this.getNodeMaxPosition(parentId)
    return ++position
  }

  async createRootNode(data: NodeCreateValue): Promise<Node> {
    const node = this.getNodeRepository().create()
    Object.assign(node, data.attributes)

    node.parent = null
    node.position = 0

    return this.getNodeRepository().save(node)
  }

  async createArchiveNodeBySpaceId(spaceId: number) {
    const rootNode = await this.getRootNodeBySpaceId(spaceId)

    let node = this.getNodeRepository().create()

    node.userId = rootNode.userId
    node.spaceId = rootNode.spaceId
    node.contentId = rootNode.spaceId
    node.title = 'Archive'
    node.type = NodeType.Archive
    node.parent = rootNode

    node = await this.getNodeRepository().save(node)
    this.updateNodePosition(node, 1)

    return node
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
    await this.registerActivityForNodeId(NodeActivities.Created, savedNode.id)

    return savedNode
  }

  async update(data: NodeUpdateValue, id: number): Promise<Node> {
    let node = await this.getNodeById(id)

    if (!node) {
      throw clientError('Error updating node')
    }

    Object.assign(node, data.attributes)

    await this.getNodeRepository().save(node)

    if (data.parent !== undefined) {
      node = await this.updateNodeParent(node, data.parent)
    }

    if (data.position !== undefined) {
      node = await this.updateNodePosition(node, data.position)
    }

    this.mediator.nodeUpdated(node)

    await this.registerActivityForNodeId(NodeActivities.Updated, node.id)

    return node
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

    if (await this.getNodeRepository().hasDescendant(node, parent.id)) {
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

  async contentUpdated(contentId: number, type: NodeType, data: IContentNodeUpdate): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    if (data.title) {
      node.title = data.title
    }

    await this.getNodeRepository().save(node)
  }

  async archive(id: number): Promise<Node> {
    let node = await this.requireNodeById(id, null, { withDeleted: true })
    node = await this._archive(node)

    await this.mediator.nodeArchived(node)
    await this.registerActivityForNode(NodeActivities.Archived, node)

    return node
  }

  async contentArchived(contentId: number, type: NodeType): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    await this._archive(node)
  }

  private async _archive(node: Node): Promise<Node> {
    this.verifyArchive(node)

    const archiveNode = await this.getArchiveNodeBySpaceId(node.spaceId)

    await this._archiveChildren(node)

    node.restoreParentId = node.parentId
    node = await this.getNodeRepository().save(node)

    node = await this.updateNodeParent(node, archiveNode.id)
    node = await this.getNodeRepository().softRemove(node)

    return node
  }

  private async _archiveChildren(node: Node): Promise<void> {
    const children = await this.getNodeRepository().getChildren(node.id)

    if (children.length === 0) {
      return
    }

    for (let child of children) {
      await this._archiveChildren(child)

      child.restoreParentId = child.parentId
      child = await this.getNodeRepository().save(child)

      child = await this.getNodeRepository().softRemove(child)
      await this.mediator.nodeArchived(child)
    }
  }

  async restore(id: number): Promise<Node> {
    let node = await this.requireNodeById(id, null, { withDeleted: true })
    node = await this._restore(node)

    await this.mediator.nodeRestored(node)
    return node
  }

  async contentRestored(contentId: number, type: NodeType): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type, {
      withDeleted: true,
    })

    if (!node) {
      return
    }

    await this._restore(node)
  }

  private async _restore(node: Node): Promise<Node> {
    this.verifyRestore(node)

    const restoreToParent = await this._getRestoreParentNode(node)
    this.updateNodeParent(node, restoreToParent.id)

    node.restoreParentId = null
    node = await this.getNodeRepository().save(node)

    node = await this.getNodeRepository().recover(node)
    await this._restoreChildren(node)

    return node
  }

  private async _restoreChildren(node: Node): Promise<void> {
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
      await this.mediator.nodeRestored(child)

      await this._restoreChildren(child)
    }
  }

  private async _getRestoreParentNode(node: Node): Promise<Node> {
    const parentNode = await this.getNodeById(node.restoreParentId)

    if (parentNode) {
      return parentNode
    }

    return this.getRootNodeBySpaceId(node.spaceId)
  }

  async remove(id: number) {
    let node = await this.requireNodeById(id, null, { withDeleted: true })
    node = await this._remove(node)

    await this.mediator.nodeRemoved(node)
    await this.registerActivityForNode(NodeActivities.Deleted, node)

    return node
  }

  async contentRemoved(contentId: number, type: NodeType): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type, {
      withDeleted: true,
    })

    if (node) {
      await this._remove(node)
    }
  }

  private async _remove(node: Node): Promise<Node> {
    this.verifyRemove(node)

    await this._removeChildren(node)
    node = await this.getNodeRepository().remove(node)

    await this.getNodeRepository().decreasePositions(node.parentId, node.position)

    return node
  }

  private async _removeChildren(node: Node): Promise<void> {
    const children = await this.getNodeRepository().getChildren(node.id, {
      withDeleted: true,
    })

    if (children.length === 0) {
      return
    }

    for (const child of children) {
      await this._removeChildren(child)

      await this.getNodeRepository().remove(child)
      await this.mediator.nodeRemoved(child)
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

  async registerActivityForNodeId(nodeActivity: NodeActivities, nodeId: number): Promise<Bull.Job> {
    const node = await this.getNodeById(nodeId)
    return this.registerActivityForNode(nodeActivity, node)
  }

  async registerActivityForNode(nodeActivity: NodeActivities, node: Node): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(nodeActivity)
        .fromActor(actor.id)
        .forEntity(node)
        .inSpace(node.spaceId)
    )
  }
}
