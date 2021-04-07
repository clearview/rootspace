import { EntityValue, attributes } from '../../../root/values'
import { ContentAccessCreateAttributes } from './types'

const attrs: ContentAccessCreateAttributes = {
  spaceId: null,
  ownerId: null,
  entityId: null,
  entity: null,
  type: null,
  public: null,
}

@attributes(attrs)
export class ContentAccessCreateValue extends EntityValue<ContentAccessCreateAttributes> {
  static fromObject(data: ContentAccessCreateAttributes) {
    return new ContentAccessCreateValue(data)
  }
}
