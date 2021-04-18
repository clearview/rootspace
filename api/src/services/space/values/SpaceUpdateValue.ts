import { EntityValue, attributes } from '../../../root/values'
import { SpaceUpdateAttributes } from './types'

export const attrs: SpaceUpdateAttributes = {
  title: null,
}

@attributes(attrs)
export class SpaceUpdateValue extends EntityValue<SpaceUpdateAttributes> {
  static fromObject(object: SpaceUpdateAttributes): SpaceUpdateValue {
    return new SpaceUpdateValue(object)
  }
}
