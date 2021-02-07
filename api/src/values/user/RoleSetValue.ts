import { EntityValue, attributes } from '../entity'
import { IUserRoleSetAttributes } from './types'

export const RoleSetAttributes: IUserRoleSetAttributes = {
  roleId: 1,
}

@attributes(RoleSetAttributes)
export class RoleSetValue extends EntityValue<IUserRoleSetAttributes> {
  static fromObject(data: IUserRoleSetAttributes) {
    return new RoleSetValue(data)
  }
}
