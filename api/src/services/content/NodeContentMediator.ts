import { Node } from '../../entities/Node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentMediator } from './contracts'
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

  async nodeDeleted(node: Node): Promise<void> {
    for (const service of this.contentServices) {
      if (node.type === service.getNodeType()) {
        return service.nodeDeleted(node.contentId)
      }
    }
  }

  async nodeUpdated(node: Node): Promise<void> {
    return
  }

  async contentDeleted(contentId: number, nodeType: NodeType): Promise<void> {
    return this.nodeService.contentDeleted(contentId, nodeType)
  }
}
