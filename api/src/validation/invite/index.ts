import { InviteAcceptValidator } from './InviteAcceptValidator'
import { InviteCreateValidator } from './InviteCreateValidator'

export function validateInviteAccept(input: object): Promise<any> {
  return new InviteAcceptValidator().validate(input)
}

export function validateInviteCreate(input: object): Promise<any> {
  return new InviteCreateValidator().validate(input)
}
