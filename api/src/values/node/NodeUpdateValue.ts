import { EntityValue, attributes } from '../entity'
import { INodeUpdateAttributes } from './types'

export const LinkUpdateAttributes: INodeUpdateAttributes = {
  title: undefined,
}

@attributes(LinkUpdateAttributes)
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
    const copy = new NodeUpdateValue(this._attributes)
    return Object.assign(copy, this)
  }

  static fromObject(data: INodeUpdateAttributes) {
    return new NodeUpdateValue(data)
  }
}
