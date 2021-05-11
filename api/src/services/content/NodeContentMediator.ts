import { ContentAccess } from '../../database/entities/ContentAccess'
import { Node } from '../../database/entities/Node'
import { ContentAccessService } from '../content-access'
import { NodeService } from './node/NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './NodeContentUpdate'

export class NodeContentMediator {
  private nodeService: NodeService
  private contentAccessService: ContentAccessService
  private contentServices: NodeContentService[] = []

  constructor(nodeService: NodeService, contentAccessService: ContentAccessService) {
    this.nodeService = nodeService
    this.contentAccessService = contentAccessService

    this.nodeService.setMediator(this)
    this.contentAccessService.setMediator(this)
  }

  addContentService(service: NodeContentService) {
    service.setMediator(this)
    this.contentServices.push(service)
  }

  async nodeCreated(node: Node, parent: Node) {
    await this.contentAccessService.nodeCreated(node, parent)
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

  async nodeAccessUpdated(node: Node, descendants: Node[], contentAccess?: ContentAccess): Promise<void> {
    return this.contentAccessService.nodeAccessUpdated(node, descendants, contentAccess)
  }

  async nodeMoved(node: Node, toParent: Node, descendants: Node[]): Promise<void> {
    this.contentAccessService.nodeMoved(node, toParent, descendants)
  }

  async contentUpdated(contentId: number, nodeType: string, actorId: number, data: INodeContentUpdate): Promise<void> {
    return this.nodeService.contentUpdated(contentId, nodeType, actorId, data)
  }

  async contentArchived(contentId: number, nodeType: string, actorId: number): Promise<void> {
    return this.nodeService.contentArchived(contentId, nodeType, actorId)
  }

  async contentRestored(contentId: number, nodeType: string, actorId: number): Promise<void> {
    return this.nodeService.contentRestored(contentId, nodeType, actorId)
  }

  async contentRemoved(contentId: number, nodeType: string, actorId: number): Promise<void> {
    return this.nodeService.contentRemoved(contentId, nodeType, actorId)
  }

  async contentAccessUpdated(contentAccess: ContentAccess): Promise<void> {
    return this.nodeService.contentAccessUpdated(contentAccess)
  }
}
