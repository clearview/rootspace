import { AttributesValue } from '../_base/AttributesValue'
import { attributes } from '../_base'
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

  set parent(value: number) {
    this._parent = value
  }

  get position(): number {
    return this._position
  }

  set position(value: number) {
    this._position = value
  }

  static fromObject(data: ILinkUpdateAttributes) {
    return new LinkUpdateValue(data)
  }
}
