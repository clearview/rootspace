import { getCustomRepository, DeleteResult } from 'typeorm'
import { NodeRepository } from '../../repositories/NodeRepository'
import { Node } from '../../entities/Node'
import { NodeCreateValue, NodeUpdateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { INodeContentMediator, IContentNodeUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'

export class NodeService {
  private mediator: INodeContentMediator

  private static instance: NodeService

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
      throw clientError('Cant not find parent node or sapce root node')
    }

    Object.assign(node, data.attributes)
    node.parent = parent

    return this.getNodeRepository().save(node)
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

  async delete(id: number) {
    const node = await this.getNodeById(id)

    if (!node) {
      throw clientError(
        'Error deleting node',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
    }

    const res = await this._delete(node)

    if (res.affected > 0) {
      await this.mediator.nodeDeleted(node)
    }

    return res
  }

  async contentUpdated(
    contentId: number,
    type: NodeType,
    data: IContentNodeUpdate
  ): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type)

    if (!node) {
      return
    }

    if (data.title) {
      node.title = data.title
    }

    await this.getNodeRepository().save(node)
  }

  async contentDeleted(contentId: number, type: NodeType): Promise<void> {
    const node = await this.getNodeByContentId(contentId, type)

    if (node) {
      await this._delete(node)
    }
  }

  private async _delete(node: Node): Promise<DeleteResult> {
    if (node.type === NodeType.Root) {
      throw clientError(
        'Can not delete space root link',
        HttpErrName.NotAllowed,
        HttpStatusCode.NotAllowed
      )
    }

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

    const res = await this.getNodeRepository().delete({
      id: node.id,
    })

    this.getNodeRepository().decreasePositions(node.parentId, node.position)

    return res
  }
}
