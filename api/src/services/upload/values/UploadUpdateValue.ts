import { EntityValue, attributes } from '../../../root/values'
import { UploadUpdateAttributes } from './types'

const attrs: UploadUpdateAttributes = {
  name: undefined,
}

@attributes(attrs)
export class UploadUpdateValue extends EntityValue<UploadUpdateAttributes> {
  static fromObject(data: UploadUpdateAttributes) {
    return new UploadUpdateValue(data)
  }
}
