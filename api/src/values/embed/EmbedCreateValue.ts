import { EntityValue, attributes } from '../../root/values'
import { IEmbedCreateAttributes } from './types'

export const EmbedCreateAttributes: IEmbedCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  type: null,
  content: null,
  parentId: null
}

@attributes(EmbedCreateAttributes)
export class EmbedCreateValue extends EntityValue<IEmbedCreateAttributes> {
  static fromObject(object: IEmbedCreateAttributes): EmbedCreateValue {
    return new EmbedCreateValue(object)
  }

  static fromObjectAndUserId(
    object: Omit<IEmbedCreateAttributes, 'userId'>,
    userId: number
  ): EmbedCreateValue {
    return EmbedCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
