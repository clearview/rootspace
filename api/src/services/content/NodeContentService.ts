import { Node } from '../../database/entities/Node'
import { Service } from '../Service'
import { NodeType } from '../../shared/constants'
import { NodeContentMediator } from './NodeContentMediator'

export abstract class NodeContentService extends Service {
  protected nodeContentMediator: NodeContentMediator

  public setMediator(mediator: NodeContentMediator): void {
    this.nodeContentMediator = mediator
  }

  abstract getNodeType(): string

  async nodeUpdated(node: Node, actorId: number): Promise<void> {
    return
  }

  abstract nodeArchived(node: Node, actorId: number): Promise<void>
  abstract nodeRestored(node: Node, actorId: number): Promise<void>
  abstract nodeRemoved(node: Node, actorId: number): Promise<void>
}
