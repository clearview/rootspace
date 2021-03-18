import { Node } from '../../database/entities/Node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './NodeContentUpdate'
import { NodeType } from '../../types/node'

export class NodeContentMediator {
  private nodeService: NodeService
  private contentServices: NodeContentService[] = []

  constructor(nodeService: NodeService) {
    this.nodeService = nodeService
    this.nodeService.setMediator(this)
  }

  addContentService(service: NodeContentService) {
    service.setMediator(this)
    this.contentServices.push(service)
  }

  async nodeUpdated(node: Node, actorId: number): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeUpdated(node, actorId)
      }
    }
  }

  async nodeArchived(node: Node, actorId: number): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeArchived(node, actorId)
      }
    }
  }

  async nodeRestored(node: Node, actorId: number): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeRestored(node, actorId)
      }
    }
  }

  async nodeRemoved(node: Node, actorId: number): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeRemoved(node, actorId)
      }
    }
  }

  async contentUpdated(
    contentId: number,
    nodeType: NodeType,
    actorId: number,
    data: INodeContentUpdate
  ): Promise<void> {
    return this.nodeService.contentUpdated(contentId, nodeType, actorId, data)
  }

  async contentArchived(contentId: number, nodeType: NodeType, actorId: number): Promise<void> {
    return this.nodeService.contentArchived(contentId, nodeType, actorId)
  }

  async contentRestored(contentId: number, nodeType: NodeType, actorId: number): Promise<void> {
    return this.nodeService.contentRestored(contentId, nodeType, actorId)
  }

  async contentRemoved(contentId: number, nodeType: NodeType, actorId: number): Promise<void> {
    return this.nodeService.contentRemoved(contentId, nodeType, actorId)
  }
}
