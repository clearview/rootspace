import { EntityValue, attributes } from '../../root/values'
import { INodeUpdateAttributes } from './types'

export const NodeUpdateAttributes: INodeUpdateAttributes = {
  title: undefined,
}

@attributes(NodeUpdateAttributes)
export class NodeUpdateValue extends EntityValue<INodeUpdateAttributes> {
  private _parent: number = undefined
  private _position: number = undefined

  get parent(): number {
    return this._parent
  }

  get position(): number {
    return this._position
  }

  withParent(parent: number): NodeUpdateValue {
    const copy = this.copy()
    copy._parent = parent
    return copy
  }

  withPosition(position: number): NodeUpdateValue {
    const copy = this.copy()
    copy._position = position
    return copy
  }

  private copy(): NodeUpdateValue {
    const copy = new NodeUpdateValue({ ...this.attributes })
    copy._parent = this._parent
    copy._position = this._position

    return copy
  }

  static fromObject(data: INodeUpdateAttributes) {
    return new NodeUpdateValue(data)
  }
}
