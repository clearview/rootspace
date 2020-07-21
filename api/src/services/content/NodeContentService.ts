import { NodeType } from '../../types/node'
import { INodeContentMediator, INodeContentUpdate } from './contracts'

export abstract class NodeContentService {
  protected nodeContentMediator: INodeContentMediator

  constructor(mediator: INodeContentMediator = null) {
    this.nodeContentMediator = mediator
  }

  public setNodeContentMediator(mediator: INodeContentMediator): void {
    this.nodeContentMediator = mediator
  }

  abstract getNodeType(): NodeType

  abstract nodeRemoved(contentId: number): Promise<void>

  async nodeUpdated(
    contentId: number,
    data: INodeContentUpdate
  ): Promise<void> {
    return
  }
}
