import { LinkCreateValidator } from './LinkCreateValidator'
import { LinkUpdateValidator } from './LinkUpdateValidator'

export function validateLinkCreate(input: object): Promise<any> {
  return new LinkCreateValidator().validate(input)
}

export function validateLinkUpdate(input: object): Promise<any> {
  return new LinkUpdateValidator().validate(input)
}
