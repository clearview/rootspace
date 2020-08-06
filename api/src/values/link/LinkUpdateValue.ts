import { EntityValue, attributes } from '../entity'
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
