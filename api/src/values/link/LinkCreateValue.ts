import { EntityValue, attributes } from '../entity'
import { ILinkCreateAttributes } from './types'

export const LinkCreateAttributes: ILinkCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  type: null,
  value: null,
}

@attributes(LinkCreateAttributes)
export class LinkCreateValue extends EntityValue<ILinkCreateAttributes> {
  private _parent: number = null

  get parent(): number {
    return this._parent
  }

  withParent(parent: number): LinkCreateValue {
    const copy = this.copy()
    copy._parent = parent
    return copy
  }

  private copy(): LinkCreateValue {
    const copy = new LinkCreateValue(this._attributes)
    return Object.assign(copy, this)
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
