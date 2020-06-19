import { EntityValue, attributes } from '../entity'
import { INodeCreateAttributes } from './types'

export const LinkCreateAttributes: INodeCreateAttributes = {
  userId: null,
  spaceId: null,
  contentId: null,
  title: null,
  type: null,
}

@attributes(LinkCreateAttributes)
export class NodeCreateValue extends EntityValue<INodeCreateAttributes> {
  private _parent: number = null

  get parent(): number {
    return this._parent
  }

  withParent(parent: number): NodeCreateValue {
    const copy = this.copy()
    copy._parent = parent
    return copy
  }

  private copy(): NodeCreateValue {
    const copy = new NodeCreateValue(this._attributes)
    return Object.assign(copy, this)
  }

  static fromObject(object: INodeCreateAttributes): NodeCreateValue {
    return new NodeCreateValue(object)
  }

  static fromObjectAndUserId(
    object: Omit<INodeCreateAttributes, 'userId'>,
    userId: number
  ): NodeCreateValue {
    return NodeCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
