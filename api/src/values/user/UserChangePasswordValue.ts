import { EntityValue, attributes } from '../entity'
import { IUserChangePasswordAttributes } from './types'

export const UserChangePasswordAttributes: IUserChangePasswordAttributes = {
  password: null,
  newPassword: null,
}

@attributes(UserChangePasswordAttributes)
export class UserChangePasswordValue extends EntityValue<
  IUserChangePasswordAttributes
> {
  static fromObject(data: IUserChangePasswordAttributes) {
    return new UserChangePasswordValue(data)
  }
}
