import { EntityValue, attributes } from '../../root/values'
import { IPasswordSetAttributes } from './types'

export const PasswordSetAttributes: IPasswordSetAttributes = {
  newPassword: null,
}

@attributes(PasswordSetAttributes)
export class PasswordSetValue extends EntityValue<IPasswordSetAttributes> {
  static fromObject(data: IPasswordSetAttributes) {
    return new PasswordSetValue(data)
  }
}
