import { EntityValue, attributes } from '../../../../root/values'
import { EmbedUpdateAttributes } from './types'

const attrs: EmbedUpdateAttributes = {
  title: undefined,
  type: undefined,
  content: undefined,
}

@attributes(attrs)
export class EmbedUpdateValue extends EntityValue<EmbedUpdateAttributes> {
  static fromObject(data: EmbedUpdateAttributes) {
    return new EmbedUpdateValue(data)
  }
}
