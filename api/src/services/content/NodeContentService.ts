import { Service } from '../Service'
import { NodeType } from '../../types/node'
import { INodeContentMediator, INodeContentUpdate } from './contracts'

export abstract class NodeContentService extends Service {
  protected nodeContentMediator: INodeContentMediator

  protected constructor(mediator: INodeContentMediator = null) {
    super()
    this.nodeContentMediator = mediator
  }

  public setMediator(mediator: INodeContentMediator): void {
    this.nodeContentMediator = mediator
  }

  abstract getNodeType(): NodeType

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
    return
  }

  abstract nodeArchived(contentId: number): Promise<void>
  abstract nodeRestored(contentId: number): Promise<void>
  abstract nodeRemoved(contentId: number): Promise<void>
}
