import { EntityValue, attributes } from '../../../root/values'
import { PasswordSetAttributes } from './types'

const attrs: PasswordSetAttributes = {
  newPassword: null,
}

@attributes(attrs)
export class PasswordSetValue extends EntityValue<PasswordSetAttributes> {
  static fromObject(data: PasswordSetAttributes) {
    return new PasswordSetValue(data)
  }
}
