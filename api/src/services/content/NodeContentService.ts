import { NodeType } from '../../types/node'
import { INodeContentMediator, INodeContentUpdate } from './contracts'

export abstract class NodeContentService {
  protected mediator: INodeContentMediator

  protected constructor(mediator: INodeContentMediator = null) {
    this.mediator = mediator
  }

  public setMediator(mediator: INodeContentMediator): void {
    this.mediator = mediator
  }

  abstract getNodeType(): NodeType

  async nodeUpdated(
    contentId: number,
    data: INodeContentUpdate
  ): Promise<void> {
    return
  }

  abstract nodeArchived(contentId: number): Promise<void>
  abstract nodeRestored(contentId: number): Promise<void>
  abstract nodeRemoved(contentId: number): Promise<void>
}
