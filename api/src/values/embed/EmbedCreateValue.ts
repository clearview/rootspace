import { EntityValue, attributes } from '../entity'
import { IEmbedCreateAttributes } from './types'

export const EmbedCreateAttributes: IEmbedCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  type: null,
  content: null,
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
