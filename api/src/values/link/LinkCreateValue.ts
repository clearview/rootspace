import { EntityValue, attributes } from '../entity'
import { ILinkCreateAttributes } from './types'

export const LinkCreateAttributes: ILinkCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  value: null,
  newTab: null
}

@attributes(LinkCreateAttributes)
export class LinkCreateValue extends EntityValue<ILinkCreateAttributes> {
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
