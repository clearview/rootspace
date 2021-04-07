import { EntityValue, attributes } from '../../root/values'
import { IPasswordChangeAttributes } from './types'

export const PasswordChangeAttributes: IPasswordChangeAttributes = {
  password: null,
  newPassword: null,
}

@attributes(PasswordChangeAttributes)
export class PasswordChangeValue extends EntityValue<IPasswordChangeAttributes> {
  static fromObject(data: IPasswordChangeAttributes) {
    return new PasswordChangeValue(data)
  }
}
