import { EntityValue, attributes } from '../../../root/values'
import { PasswordChangeAttributes } from './types'

const attrs: PasswordChangeAttributes = {
  password: null,
  newPassword: null,
}

@attributes(attrs)
export class PasswordChangeValue extends EntityValue<PasswordChangeAttributes> {
  static fromObject(data: PasswordChangeAttributes) {
    return new PasswordChangeValue(data)
  }
}
