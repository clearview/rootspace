import { EntityValue, attributes } from '../../root/values'
import { IUploadCreateAttributes } from './types'

export const UploadCreateAttributes: IUploadCreateAttributes = {
  userId: null,
  filename: null,
}

@attributes(UploadCreateAttributes)
export class UploadCreateValue extends EntityValue<IUploadCreateAttributes> {
  static fromObject(object: IUploadCreateAttributes): UploadCreateValue {
    return new UploadCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<IUploadCreateAttributes, 'userId'>, userId: number): UploadCreateValue {
    return UploadCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
