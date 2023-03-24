import { EntityValue, attributes } from '../../../root/values'
import { PasswordRecoveryAttributes } from './types'

const attrs: PasswordRecoveryAttributes = {
  email: null,
  urlQueryParams: null,
}

@attributes(attrs)
export class PasswordRecoveryValue extends EntityValue<PasswordRecoveryAttributes> {
  static fromObject(data: PasswordRecoveryAttributes) {
    return new PasswordRecoveryValue(data)
  }
}
