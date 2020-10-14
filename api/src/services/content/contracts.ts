import { Node } from '../../database/entities/Node'
import { NodeType } from '../../types/node'

export interface INodeContentMediator {
  nodeUpdated(node: Node): Promise<void>
  nodeArchived(node: Node): Promise<void>
  nodeRestored(node: Node): Promise<void>
  nodeRemoved(node: Node): Promise<void>
  contentUpdated(contentId: number, nodeType: NodeType, data: IContentNodeUpdate): Promise<void>
  contentArchived(contentId: number, nodeType: NodeType): Promise<void>
  contentRestored(contentId: number, nodeType: NodeType): Promise<void>
  contentRemoved(contentId: number, nodeType: NodeType): Promise<void>
}

export interface INodeContentUpdate {
  title?: string
}

export interface IContentNodeUpdate {
  title?: string
}