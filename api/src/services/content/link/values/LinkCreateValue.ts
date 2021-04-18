import { EntityValue, attributes } from '../../../../root/values'
import { LinkCreateAttributes } from './types'

const attrs: LinkCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  value: null,
  newTab: null,
  parentId: null,
}

@attributes(attrs)
export class LinkCreateValue extends EntityValue<LinkCreateAttributes> {
  static fromObject(object: LinkCreateAttributes): LinkCreateValue {
    return new LinkCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<LinkCreateAttributes, 'userId'>, userId: number): LinkCreateValue {
    return LinkCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
