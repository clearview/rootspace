import { EntityValue, attributes } from '../entity'
import { ISpaceUpdateAttributes } from './types'

export const SpaceUpdateAttributes = {
  title: null,
}

@attributes(SpaceUpdateAttributes)
export class SpaceUpdateValue extends EntityValue<ISpaceUpdateAttributes> {
  static fromObject(object: ISpaceUpdateAttributes): SpaceUpdateValue {
    return new SpaceUpdateValue(object)
  }
}
