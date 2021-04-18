import { SpaceUserUpdateValidator } from './SpaceUserUpdateValidator'

export function validateSpaceUserUpdate(data: object): Promise<any> {
  return new SpaceUserUpdateValidator().validate(data)
}
