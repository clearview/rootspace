import { EntityValue, attributes } from '../entity'
import { IEmbedUpdateAttributes } from './types'

export const EmbedUpdateAttributes: IEmbedUpdateAttributes = {
  title: undefined,
  type: undefined,
  content: undefined,
}

@attributes(EmbedUpdateAttributes)
export class EmbedUpdateValue extends EntityValue<IEmbedUpdateAttributes> {
  static fromObject(data: IEmbedUpdateAttributes) {
    return new EmbedUpdateValue(data)
  }
}
