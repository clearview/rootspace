import { AttributesValue } from '../AttributesValue'
import { attributes } from '../attributes'
import { ILinkUpdateAttributes } from './types'

export const LinkUpdateAttributes: ILinkUpdateAttributes = {
  title: undefined,
  value: undefined,
}

@attributes(LinkUpdateAttributes)
export class LinkUpdateValue extends AttributesValue<ILinkUpdateAttributes> {
  private _parent: number = undefined
  private _position: number = undefined

  get parent(): number {
    return this._parent
  }

  get position(): number {
    return this._position
  }

  withParent(parent: number): LinkUpdateValue {
    const value = new LinkUpdateValue(this._attributes)
    value._parent = parent

    return value
  }

  withPosition(position: number): LinkUpdateValue {
    const value = new LinkUpdateValue(this._attributes)
    value._position = position

    return value
  }

  static fromObject(data: ILinkUpdateAttributes) {
    return new LinkUpdateValue(data)
  }
}
