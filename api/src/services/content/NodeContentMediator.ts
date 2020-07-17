import { Node } from '../../database/entities/Node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentMediator, IContentNodeUpdate } from './contracts'
import { NodeType } from '../../types/node'

export class NodeContentMediator implements INodeContentMediator {
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

  async nodeRemoved(node: Node): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeRemoved(node.contentId)
      }
    }
  }

  async nodeUpdated(node: Node): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeUpdated(node.contentId, { title: node.title })
      }
    }
  }

  async contentRemoved(contentId: number, nodeType: NodeType): Promise<void> {
    return this.nodeService.contentRemoved(contentId, nodeType)
  }

  async contentUpdated(
    contentId: number,
    nodeType: NodeType,
    data: IContentNodeUpdate
  ): Promise<void> {
    return this.nodeService.contentUpdated(contentId, nodeType, data)
  }
}
