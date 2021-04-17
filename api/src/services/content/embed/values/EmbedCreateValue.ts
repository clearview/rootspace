import { EntityValue, attributes } from '../../../../root/values'
import { EmbedCreateAttributes } from './types'

const attrs: EmbedCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  type: null,
  content: null,
  parentId: null,
}

@attributes(attrs)
export class EmbedCreateValue extends EntityValue<EmbedCreateAttributes> {
  static fromObject(object: EmbedCreateAttributes): EmbedCreateValue {
    return new EmbedCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<EmbedCreateAttributes, 'userId'>, userId: number): EmbedCreateValue {
    return EmbedCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
