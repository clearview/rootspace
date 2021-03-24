import { BaseValidator } from '../BaseValidator'

export class InviteCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      invites: 'required|array',
    }
  }
}
