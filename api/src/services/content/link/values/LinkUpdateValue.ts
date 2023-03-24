import { EntityValue, attributes } from '../../../../root/values'
import { LinkUpdateAttributes } from './types'

const attrs: LinkUpdateAttributes = {
  title: undefined,
  value: undefined,
  newTab: undefined,
}

@attributes(attrs)
export class LinkUpdateValue extends EntityValue<LinkUpdateAttributes> {
  static fromObject(data: LinkUpdateAttributes) {
    return new LinkUpdateValue(data)
  }
}
