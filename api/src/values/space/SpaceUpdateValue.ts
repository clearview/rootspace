import { AttributesValue } from '../AttributesValue'
import { attributes } from '../attributes'
import { ISpaceUpdateAttributes } from './types'

export const SpaceUpdateAttributes = {
  title: null,
}

@attributes(SpaceUpdateAttributes)
export class SpaceUpdateValue extends AttributesValue<ISpaceUpdateAttributes> {
  static fromObject(object: ISpaceUpdateAttributes): SpaceUpdateValue {
    return new SpaceUpdateValue(object)
  }
}
