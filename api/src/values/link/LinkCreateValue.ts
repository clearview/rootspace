import { AttributesValue } from '../_base/AttributesValue'
import { attributes } from '../_base'
import { ILinkCreateAttributes } from './types'

export const LinkCreateAttributes: ILinkCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  type: null,
  value: null,
}

@attributes(LinkCreateAttributes)
export class LinkCreateValue extends AttributesValue<ILinkCreateAttributes> {
  private _parent: number = null

  get parent(): number {
    return this._parent
  }

  withParent(parent: number): LinkCreateValue {
    const value = new LinkCreateValue(this._attributes)
    value._parent = parent

    return value
  }

  static fromObject(object: ILinkCreateAttributes): LinkCreateValue {
    return new LinkCreateValue(object)
  }

  static fromObjectAndUserId(
    object: Omit<ILinkCreateAttributes, 'userId'>,
    userId: number
  ): LinkCreateValue {
    return LinkCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
