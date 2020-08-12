import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
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

  getNodeById(id: number, spaceId?: number): Promise<Node> {
    return this.getNodeRepository().getById(id, spaceId)
  }

  getNodeByContentId(contentId: number, type: NodeType): Promise<Node> {
    return this.getNodeRepository().findOne({ where: { contentId, type } })
  }

  getArchivedNodeByContentId(contentId: number, type: NodeType): Promise<Node> {
    return this.getNodeRepository().findOneArchived(contentId, type)
  }

  getRootNodeBySpaceId(spaceId: number): Promise<Node> {
    return this.getNodeRepository().getRootBySpaceId(spaceId)
  }

  getTreeBySpaceId(spaceId: number): Promise<Node[]> {
    return this.getNodeRepository().getTreeBySpaceId(spaceId)
  }

  getNodeMaxPosition(parentId: number): Promise<number> {
    return this.getNodeRepository().getNodeMaxPosition(parentId)
  }

  async getNodeNextPosition(parentId: number): Promise<number> {
    let position = await this.getNodeMaxPosition(parentId)
    return ++position
  }

  async createRootNode(data: NodeCreateValue): Promise<Node> {
    const link = this.getNodeRepository().create()

    Object.assign(link, data.attributes)

    link.parent = null
    link.position = 0

    return this.getNodeRepository().save(link)
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
    node = await this.getNodeRepository().save(node)

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
      await this.getNodeRepository().decreasePositions(
        parentId,
        fromPosition,
        toPosition
      )
    }

    if (toPosition < fromPosition) {
      await this.getNodeRepository().increasePositions(
        parentId,
        toPosition,
        fromPosition
      )
    }

    node.position = toPosition

    return this.getNodeRepository().save(node)
  }

  async remove(id: number) {
    const node = await this.getNodeById(id)

    if (!node) {
      throw clientError(
        'Error deleting node',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
    }

    const removedNode = await this._remove(node)
    await this.mediator.nodeRemoved(removedNode)

    return node
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

  async contentArchived(contentId: number, type: NodeType): Promise<Node> {
    const node = await this.getNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    await this._archive(node)
  }

  async contentRestored(contentId: number, type: NodeType): Promise<Node> {
    const node = await this.getArchivedNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    await this.getNodeRepository().recover(node)
  }

  async contentRemoved(contentId: number, type: NodeType): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type)

    if (node) {
      await this._remove(node)
    }
  }

  private async _archive(node: Node): Promise<Node> {
    await this.recalculatePositions(node)
    await this.registerActivityForNode(NodeActivities.Archived, node)

    const archivedNode = await this.getNodeRepository().softRemove(node)
    await this.getNodeRepository().decreasePositions(archivedNode.parentId, archivedNode.position)

    return archivedNode
  }

  private async _remove(node: Node): Promise<Node> {
    await this.recalculatePositions(node)
    await this.registerActivityForNode(NodeActivities.Deleted, node)

    const removedNode = await this.getNodeRepository().remove(node)
    await this.getNodeRepository().decreasePositions(removedNode.parentId, removedNode.position)

    return removedNode
  }

  private static checkNodeIsNotRootNode(node: Node): void {
    if (node.type === NodeType.Root) {
      throw clientError(
        'Can not delete space root link',
        HttpErrName.NotAllowed,
        HttpStatusCode.NotAllowed
      )
    }
  }

  private async recalculatePositions(node: Node): Promise<void> {
    NodeService.checkNodeIsNotRootNode(node)

    const children = await this.getNodeRepository().getChildren(node.id)

    if (children.length > 0) {
      const parent = await this.getNodeById(node.parentId)

      if (!parent) {
        throw clientError(HttpErrName.EntityDeleteFailed)
      }

      let nextPosition = await this.getNodeNextPosition(parent.id)

      await Promise.all(
        children.map(
          function(child: Node) {
            child.parent = parent
            child.position = nextPosition++
            return this.getNodeRepository().save(child)
          }.bind(this)
        )
      )
    }
  }

  async registerActivityForNodeId(nodeActivity: NodeActivities, nodeId: number): Promise<Bull.Job> {
    const node = await this.getNodeById(nodeId)
    return this.registerActivityForNode(nodeActivity, node)
  }

  async registerActivityForNode(nodeActivity: NodeActivities, node: Node): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent
        .withAction(nodeActivity)
        .fromActor(actor.id)
        .forEntity(node)
        .inSpace(node.spaceId)
    )
  }
}
