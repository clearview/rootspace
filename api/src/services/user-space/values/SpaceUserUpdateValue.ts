import { EntityValue, attributes } from '../../../root/values'

type SpaceUserUpdateAttributes = {
  readonly role: number
}

const attrs: SpaceUserUpdateAttributes = {
  role: undefined,
}

@attributes(attrs)
export class SpaceUserUpdateValue extends EntityValue<SpaceUserUpdateAttributes> {
  static fromObject(object: SpaceUserUpdateAttributes): SpaceUserUpdateValue {
    return new SpaceUserUpdateValue(object)
  }
}
