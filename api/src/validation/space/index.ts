import { SpaceCreateValidator } from './SpaceCreateValidator'
import { SpaceUpdateValidator } from './SpaceUpdateValidator'

export function validateSpaceCreate(data: object): Promise<any> {
  return new SpaceCreateValidator().validate(data)
}

export function validateSpaceUpdate(data: object): Promise<any> {
  return new SpaceUpdateValidator().validate(data)
}
