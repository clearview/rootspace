import { EntityValue, attributes } from '../entity'
import { ILinkUpdateAttributes } from './types'

export const LinkUpdateAttributes: ILinkUpdateAttributes = {
  title: undefined,
  value: undefined,
}

@attributes(LinkUpdateAttributes)
export class LinkUpdateValue extends EntityValue<ILinkUpdateAttributes> {
  private _parent: number = undefined
  private _position: number = undefined

  get parent(): number {
    return this._parent
  }

  get position(): number {
    return this._position
  }

  withParent(parent: number): LinkUpdateValue {
    const copy = this.copy()
    copy._parent = parent
    return copy
  }

  withPosition(position: number): LinkUpdateValue {
    const copy = this.copy()
    copy._position = position
    return copy
  }

  private copy(): LinkUpdateValue {
    const copy = new LinkUpdateValue(this._attributes)
    return Object.assign(copy, this)
  }

  static fromObject(data: ILinkUpdateAttributes) {
    return new LinkUpdateValue(data)
  }
}
