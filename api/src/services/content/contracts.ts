import { Node } from '../../database/entities/Node'
import { NodeType } from '../../types/node'

export interface INodeContentMediator {
  nodeDeleted(node: Node): Promise<void>
  nodeUpdated(node: Node): Promise<void>
  contentDeleted(contentId: number, nodeType: NodeType): Promise<void>
  contentUpdated(
    contentId: number,
    nodeType: NodeType,
    data: IContentNodeUpdate
  ): Promise<void>
}

export interface INodeContentUpdate {
  title?: string
}

export interface IContentNodeUpdate {
  title?: string
}
