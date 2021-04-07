import { EntityValue, attributes } from '../../root/values'
import { IPasswordResetAttributes } from './types'

export const PasswordResetAttributes: IPasswordResetAttributes = {
  token: null,
  password: null
}

@attributes(PasswordResetAttributes)
export class PasswordResetValue extends EntityValue<IPasswordResetAttributes> {
  static fromObject(data: IPasswordResetAttributes) {
    return new PasswordResetValue(data)
  }
}
