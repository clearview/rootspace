import { EntityValue, attributes } from '../../../root/values'
import { PasswordResetAttributes } from './types'

const attrs: PasswordResetAttributes = {
  token: null,
  password: null,
}

@attributes(attrs)
export class PasswordResetValue extends EntityValue<PasswordResetAttributes> {
  static fromObject(data: PasswordResetAttributes) {
    return new PasswordResetValue(data)
  }
}
