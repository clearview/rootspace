import { Node } from '../../entities/Node'
import { NodeType } from '../../types/node'

export interface INodeContentMediator {
  nodeDeleted(node: Node): Promise<void>
  contentDeleted(contentId: number, nodeType: NodeType): Promise<void>
}
