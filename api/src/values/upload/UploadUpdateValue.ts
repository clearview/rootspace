import { EntityValue, attributes } from '../../root/values'
import { IUploadUpdateAttributes } from './types'

export const UploadUpdateAttributes: IUploadUpdateAttributes = {
  filename: undefined,
}

@attributes(UploadUpdateAttributes)
export class UploadUpdateValue extends EntityValue<IUploadUpdateAttributes> {
  static fromObject(data: IUploadUpdateAttributes) {
    return new UploadUpdateValue(data)
  }
}
