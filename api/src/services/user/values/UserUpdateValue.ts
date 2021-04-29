import { EntityValue, attributes } from '../../../root/values'
import { UserUpdateAttributes } from './types'

const attrs: UserUpdateAttributes = {
  firstName: undefined,
  lastName: undefined,
}

@attributes(attrs)
export class UserUpdateValue extends EntityValue<UserUpdateAttributes> {
  static fromObject(data: UserUpdateAttributes) {
    return new UserUpdateValue(data)
  }
}
