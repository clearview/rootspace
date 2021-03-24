import { EntityValue, attributes } from '../entity'
import { ISpaceUserUpdateAttributes } from './attributes'

export const UpdateAttributes: ISpaceUserUpdateAttributes = {
  role: undefined,
}

@attributes(UpdateAttributes)
export class SpaceUserUpdateValue extends EntityValue<ISpaceUserUpdateAttributes> {
  static fromObject(object: ISpaceUserUpdateAttributes): SpaceUserUpdateValue {
    return new SpaceUserUpdateValue(object)
  }
}
