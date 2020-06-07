import { AttributesValue } from '../AttributesValue'
import { attributes } from '../attributes'
import { ISpaceCreateAttributes } from './types'

export const SpaceCreateAttributes = {
  userId: null,
  title: null,
}

@attributes(SpaceCreateAttributes)
export class SpaceCreateValue extends AttributesValue<ISpaceCreateAttributes> {
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
