import { EntityValue, attributes } from '../../root/values'
import { ILinkUpdateAttributes } from './types'

export const LinkUpdateAttributes: ILinkUpdateAttributes = {
  title: undefined,
  value: undefined,
  newTab: undefined,
}

@attributes(LinkUpdateAttributes)
export class LinkUpdateValue extends EntityValue<ILinkUpdateAttributes> {
  static fromObject(data: ILinkUpdateAttributes) {
    return new LinkUpdateValue(data)
  }
}
