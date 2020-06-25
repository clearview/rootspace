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
  private _parent: number = undefined
  private _position: number = undefined

  get parent(): number {
    return this._parent
  }

  get position(): number {
    return this._position
  }

  withParent(parent: number): NodeCreateValue {
    const copy = this.copy()
    copy._parent = parent
    return copy
  }

  withPosition(position: number): NodeCreateValue {
    const copy = this.copy()
    copy._position = position
    return copy
  }

  private copy(): NodeCreateValue {
    const copy = new NodeCreateValue({ ...this.attributes })
    copy._parent = this._parent
    copy._position = this._position

    return copy
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
