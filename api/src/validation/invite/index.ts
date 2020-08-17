import { InviteAcceptValidator } from './InviteAcceptValidator'
import { InviteCreateValidator } from './InviteCreateValidator'
import { InviteCancelValidator } from './InviteCancelValidator'

export function validateInviteAccept(input: object): Promise<any> {
  return new InviteAcceptValidator().validate(input)
}

export function validateInviteCreate(input: object): Promise<any> {
  return new InviteCreateValidator().validate(input)
}

export function validateInviteCancel(input: object): Promise<any> {
  return new InviteCancelValidator().validate(input)
}
