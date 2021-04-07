import { EntityValue, attributes } from '../../root/values'
import { IUserUpdateAttributes } from './types'

export const UserUpdateAttributes: IUserUpdateAttributes = {
  firstName: undefined,
  lastName: undefined,
  email: undefined,
}

@attributes(UserUpdateAttributes)
export class UserUpdateValue extends EntityValue<IUserUpdateAttributes> {
  static fromObject(data: IUserUpdateAttributes) {
    return new UserUpdateValue(data)
  }
}
