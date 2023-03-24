import { EntityValue, attributes } from '../../../root/values'
import { SpaceCreateAttributes } from './types'

const attrs: SpaceCreateAttributes = {
  userId: null,
  title: null,
}

@attributes(attrs)
export class SpaceCreateValue extends EntityValue<SpaceCreateAttributes> {
  static fromObject(object: SpaceCreateAttributes): SpaceCreateValue {
    return new SpaceCreateValue(object)
  }

  static fromObjectAndUserId(object: SpaceCreateAttributes, userId: number): SpaceCreateValue {
    Object.assign(object, { userId })
    return SpaceCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
