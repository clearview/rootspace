import { EntityValue, attributes } from '../../../root/values'
import { ContentAccessUpdateAttributes } from './types'

const attrs: ContentAccessUpdateAttributes = {
  type: undefined,
  public: undefined,
}

@attributes(attrs)
export class ContentAccessUpdateValue extends EntityValue<ContentAccessUpdateAttributes> {
  static fromObject(data: ContentAccessUpdateAttributes) {
    return new ContentAccessUpdateValue(data)
  }
}
