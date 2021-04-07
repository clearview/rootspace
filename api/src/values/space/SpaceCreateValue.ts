import { EntityValue, attributes } from '../../root/values'
import { ISpaceCreateAttributes } from './types'

export const SpaceCreateAttributes = {
  userId: null,
  title: null,
}

@attributes(SpaceCreateAttributes)
export class SpaceCreateValue extends EntityValue<ISpaceCreateAttributes> {
  static fromObject(object: ISpaceCreateAttributes): SpaceCreateValue {
    return new SpaceCreateValue(object)
  }

  static fromObjectAndUserId(
    object: ISpaceCreateAttributes,
    userId: number
  ): SpaceCreateValue {
    Object.assign(object, { userId })
    return SpaceCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
