import { EntityValue, attributes } from '../../../../root/values'
import { NodeCreateAttributes } from './types'

const attrs: NodeCreateAttributes = {
  userId: null,
  spaceId: null,
  contentId: null,
  title: null,
  type: null,
  config: null,
}

@attributes(attrs)
export class NodeCreateValue extends EntityValue<NodeCreateAttributes> {
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

  static fromObject(object: NodeCreateAttributes): NodeCreateValue {
    return new NodeCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<NodeCreateAttributes, 'userId'>, userId: number): NodeCreateValue {
    return NodeCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
