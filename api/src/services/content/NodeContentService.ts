import { NodeType } from '../../types/node'
import { INodeContentMediator, INodeContentUpdate } from './contracts'

export abstract class NodeContentService {
  protected mediator: INodeContentMediator

  constructor(mediator: INodeContentMediator = null) {
    this.mediator = mediator
  }

  public setMediator(mediator: INodeContentMediator): void {
    this.mediator = mediator
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
